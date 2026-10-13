package com.campusgig.service;

import com.campusgig.dto.ContractDto;
import com.campusgig.dto.MilestoneDto;
import com.campusgig.entity.*;
import com.campusgig.enums.ContractStatus;
import com.campusgig.enums.NotificationType;
import com.campusgig.enums.ProjectStatus;
import com.campusgig.enums.RoleType;
import com.campusgig.exception.BadRequestException;
import com.campusgig.exception.ForbiddenException;
import com.campusgig.exception.ResourceNotFoundException;
import com.campusgig.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContractService {

    private final ContractRepository contractRepository;
    private final MilestoneRepository milestoneRepository;
    private final ProjectRepository projectRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final NotificationRepository notificationRepository;
    private final ReviewRepository reviewRepository;

    public ContractService(ContractRepository contractRepository,
                           MilestoneRepository milestoneRepository,
                           ProjectRepository projectRepository,
                           StudentProfileRepository studentProfileRepository,
                           NotificationRepository notificationRepository,
                           ReviewRepository reviewRepository) {
        this.contractRepository = contractRepository;
        this.milestoneRepository = milestoneRepository;
        this.projectRepository = projectRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.notificationRepository = notificationRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<ContractDto> getContractsForUser(User user) {
        List<Contract> contracts;
        if (user.getRole().getName() == RoleType.ROLE_CLIENT) {
            contracts = contractRepository.findByClientIdOrderByStartDateDesc(user.getId());
        } else if (user.getRole().getName() == RoleType.ROLE_STUDENT) {
            contracts = contractRepository.findByStudentIdOrderByStartDateDesc(user.getId());
        } else {
            contracts = contractRepository.findAll();
        }

        return contracts.stream().map(c -> {
            ContractDto dto = ContractDto.fromEntity(c);
            dto.setHasReview(reviewRepository.existsByContractId(c.getId()));
            return dto;
        }).collect(Collectors.toList());
    }

    public ContractDto getContractById(Long contractId, User user) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with ID: " + contractId));

        boolean isParticipant = contract.getClient().getId().equals(user.getId()) ||
                                contract.getStudent().getId().equals(user.getId()) ||
                                user.getRole().getName() == RoleType.ROLE_ADMIN;

        if (!isParticipant) {
            throw new ForbiddenException("You are not authorized to view this contract.");
        }

        ContractDto dto = ContractDto.fromEntity(contract);
        dto.setHasReview(reviewRepository.existsByContractId(contract.getId()));
        return dto;
    }

    @Transactional
    public ContractDto updateContractStatus(User user, Long contractId, ContractStatus status) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with ID: " + contractId));

        boolean isClient = contract.getClient().getId().equals(user.getId());
        boolean isStudent = contract.getStudent().getId().equals(user.getId());
        boolean isAdmin = user.getRole().getName() == RoleType.ROLE_ADMIN;

        if (!isClient && !isStudent && !isAdmin) {
            throw new ForbiddenException("You are not authorized to update this contract.");
        }

        contract.setStatus(status);

        if (status == ContractStatus.COMPLETED) {
            contract.setCompletedDate(LocalDateTime.now());
            // Update project status
            Project project = contract.getProject();
            project.setStatus(ProjectStatus.COMPLETED);
            projectRepository.save(project);

            // Update student earnings and completed count
            studentProfileRepository.findByUserId(contract.getStudent().getId()).ifPresent(sp -> {
                sp.setCompletedProjects((sp.getCompletedProjects() != null ? sp.getCompletedProjects() : 0) + 1);
                sp.setTotalEarned((sp.getTotalEarned() != null ? sp.getTotalEarned() : java.math.BigDecimal.ZERO).add(contract.getAgreedAmount()));
                studentProfileRepository.save(sp);
            });

            // Notify client to leave a review
            Notification notif = new Notification(
                    contract.getClient(),
                    "Project Completed!",
                    "\"" + contract.getProject().getTitle() + "\" has been completed. Please leave a rating and review for " + contract.getStudent().getFullName() + "!",
                    NotificationType.STATUS_CHANGE,
                    contract.getId()
            );
            notificationRepository.save(notif);
        }

        Contract saved = contractRepository.save(contract);
        ContractDto dto = ContractDto.fromEntity(saved);
        dto.setHasReview(reviewRepository.existsByContractId(saved.getId()));
        return dto;
    }

    @Transactional
    public MilestoneDto addMilestone(User user, Long contractId, MilestoneDto dto) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with ID: " + contractId));

        if (!contract.getClient().getId().equals(user.getId()) && !contract.getStudent().getId().equals(user.getId()) && user.getRole().getName() != RoleType.ROLE_ADMIN) {
            throw new ForbiddenException("You are not authorized to add milestones to this contract.");
        }

        Milestone milestone = new Milestone();
        milestone.setContract(contract);
        milestone.setTitle(dto.getTitle().trim());
        milestone.setDescription(dto.getDescription());
        milestone.setAmount(dto.getAmount());
        milestone.setDueDate(dto.getDueDate());
        milestone.setStatus("PENDING");

        Milestone saved = milestoneRepository.save(milestone);
        return MilestoneDto.fromEntity(saved);
    }

    @Transactional
    public MilestoneDto updateMilestoneStatus(User user, Long milestoneId, String status) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found with ID: " + milestoneId));

        Contract contract = milestone.getContract();
        boolean isClient = contract.getClient().getId().equals(user.getId());
        boolean isStudent = contract.getStudent().getId().equals(user.getId());

        if (!isClient && !isStudent && user.getRole().getName() != RoleType.ROLE_ADMIN) {
            throw new ForbiddenException("You are not authorized to update this milestone.");
        }

        milestone.setStatus(status.toUpperCase());
        Milestone saved = milestoneRepository.save(milestone);

        User notifyTarget = isClient ? contract.getStudent() : contract.getClient();
        Notification notif = new Notification(
                notifyTarget,
                "Milestone Updated",
                "Milestone \"" + milestone.getTitle() + "\" was updated to " + status + ".",
                NotificationType.MILESTONE_UPDATED,
                contract.getId()
        );
        notificationRepository.save(notif);

        return MilestoneDto.fromEntity(saved);
    }
}
