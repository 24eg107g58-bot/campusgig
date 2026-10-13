package com.campusgig.service;

import com.campusgig.dto.ProposalCreateDto;
import com.campusgig.dto.ProposalDto;
import com.campusgig.entity.*;
import com.campusgig.enums.*;
import com.campusgig.exception.BadRequestException;
import com.campusgig.exception.ForbiddenException;
import com.campusgig.exception.ResourceNotFoundException;
import com.campusgig.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProposalService {

    private final ProposalRepository proposalRepository;
    private final ProjectRepository projectRepository;
    private final ContractRepository contractRepository;
    private final ConversationRepository conversationRepository;
    private final NotificationRepository notificationRepository;
    private final StudentProfileRepository studentProfileRepository;

    public ProposalService(ProposalRepository proposalRepository,
                           ProjectRepository projectRepository,
                           ContractRepository contractRepository,
                           ConversationRepository conversationRepository,
                           NotificationRepository notificationRepository,
                           StudentProfileRepository studentProfileRepository) {
        this.proposalRepository = proposalRepository;
        this.projectRepository = projectRepository;
        this.contractRepository = contractRepository;
        this.conversationRepository = conversationRepository;
        this.notificationRepository = notificationRepository;
        this.studentProfileRepository = studentProfileRepository;
    }

    public List<ProposalDto> getProposalsForProject(User currentUser, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + projectId));

        boolean isClient = project.getClient().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole().getName() == RoleType.ROLE_ADMIN;

        if (!isClient && !isAdmin) {
            // A student can only view their own proposal for this project
            return proposalRepository.findByProjectIdAndStudentId(projectId, currentUser.getId())
                    .map(p -> List.of(enrichProposalDto(p)))
                    .orElse(List.of());
        }

        return proposalRepository.findByProjectIdOrderByCreatedAtDesc(projectId).stream()
                .map(this::enrichProposalDto)
                .collect(Collectors.toList());
    }

    public List<ProposalDto> getProposalsByStudent(User student) {
        return proposalRepository.findByStudentIdOrderByCreatedAtDesc(student.getId()).stream()
                .map(this::enrichProposalDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProposalDto submitProposal(User user, ProposalCreateDto dto) {
        if (user.getRole().getName() != RoleType.ROLE_STUDENT) {
            throw new ForbiddenException("Only registered students can submit proposals.");
        }

        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + dto.getProjectId()));

        if (project.getClient().getId().equals(user.getId())) {
            throw new BadRequestException("You cannot submit a proposal to your own project.");
        }

        if (project.getStatus() != ProjectStatus.OPEN) {
            throw new BadRequestException("This project is no longer accepting proposals (Status: " + project.getStatus() + ").");
        }

        if (proposalRepository.existsByProjectIdAndStudentId(project.getId(), user.getId())) {
            throw new BadRequestException("You have already submitted a proposal for this project.");
        }

        Proposal proposal = new Proposal();
        proposal.setProject(project);
        proposal.setStudent(user);
        proposal.setCoverLetter(dto.getCoverLetter().trim());
        proposal.setBidAmount(dto.getBidAmount());
        proposal.setDeliveryDays(dto.getDeliveryDays());
        proposal.setStatus(ProposalStatus.PENDING);

        Proposal saved = proposalRepository.save(proposal);

        // Notify project client
        Notification notif = new Notification(
                project.getClient(),
                "New Proposal Submitted",
                user.getFullName() + " submitted a proposal of $" + dto.getBidAmount() + " for \"" + project.getTitle() + "\"",
                NotificationType.PROPOSAL_SUBMITTED,
                saved.getId()
        );
        notificationRepository.save(notif);

        return enrichProposalDto(saved);
    }

    @Transactional
    public ProposalDto acceptProposal(User currentUser, Long proposalId) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found with ID: " + proposalId));

        Project project = proposal.getProject();
        if (!project.getClient().getId().equals(currentUser.getId()) && currentUser.getRole().getName() != RoleType.ROLE_ADMIN) {
            throw new ForbiddenException("Only the project owner can accept proposals.");
        }

        if (proposal.getStatus() == ProposalStatus.ACCEPTED) {
            throw new BadRequestException("This proposal has already been accepted.");
        }

        proposal.setStatus(ProposalStatus.ACCEPTED);
        project.setStatus(ProjectStatus.IN_PROGRESS);
        projectRepository.save(project);
        Proposal savedProposal = proposalRepository.save(proposal);

        // Create Contract
        Contract contract = new Contract();
        contract.setProject(project);
        contract.setClient(project.getClient());
        contract.setStudent(proposal.getStudent());
        contract.setAgreedAmount(proposal.getBidAmount());
        contract.setStatus(ContractStatus.ACTIVE);
        contract.setNotes("Contract initialized automatically upon accepting proposal #" + proposal.getId());
        contractRepository.save(contract);

        // Ensure Conversation exists
        conversationRepository.findBetweenUsers(project.getClient().getId(), proposal.getStudent().getId())
                .orElseGet(() -> conversationRepository.save(new Conversation(project.getClient(), proposal.getStudent())));

        // Notify Student
        Notification notif = new Notification(
                proposal.getStudent(),
                "Proposal Accepted! You are Hired!",
                "Congratulations! " + project.getClient().getFullName() + " accepted your proposal for \"" + project.getTitle() + "\".",
                NotificationType.PROPOSAL_ACCEPTED,
                contract.getId()
        );
        notificationRepository.save(notif);

        return enrichProposalDto(savedProposal);
    }

    @Transactional
    public ProposalDto rejectProposal(User currentUser, Long proposalId) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found with ID: " + proposalId));

        Project project = proposal.getProject();
        if (!project.getClient().getId().equals(currentUser.getId()) && currentUser.getRole().getName() != RoleType.ROLE_ADMIN) {
            throw new ForbiddenException("Only the project owner can reject proposals.");
        }

        proposal.setStatus(ProposalStatus.REJECTED);
        Proposal saved = proposalRepository.save(proposal);

        // Notify student
        Notification notif = new Notification(
                proposal.getStudent(),
                "Proposal Status Update",
                "Your proposal for \"" + project.getTitle() + "\" was not selected.",
                NotificationType.PROPOSAL_REJECTED,
                proposal.getId()
        );
        notificationRepository.save(notif);

        return enrichProposalDto(saved);
    }

    private ProposalDto enrichProposalDto(Proposal p) {
        ProposalDto dto = ProposalDto.fromEntity(p);
        if (p.getStudent() != null) {
            studentProfileRepository.findByUserId(p.getStudent().getId()).ifPresent(sp -> {
                dto.setStudentUniversity(sp.getUniversity());
                dto.setStudentDegree(sp.getDegree());
                dto.setStudentRating(sp.getRatingAvg());
            });
        }
        return dto;
    }
}
