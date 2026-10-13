package com.campusgig.service;

import com.campusgig.dto.ProjectCreateDto;
import com.campusgig.dto.ProjectDto;
import com.campusgig.entity.Project;
import com.campusgig.entity.Skill;
import com.campusgig.entity.User;
import com.campusgig.enums.ProjectStatus;
import com.campusgig.enums.RoleType;
import com.campusgig.exception.ForbiddenException;
import com.campusgig.exception.ResourceNotFoundException;
import com.campusgig.repository.ProjectRepository;
import com.campusgig.repository.ProposalRepository;
import com.campusgig.repository.SkillRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProposalRepository proposalRepository;
    private final SkillRepository skillRepository;

    public ProjectService(ProjectRepository projectRepository,
                          ProposalRepository proposalRepository,
                          SkillRepository skillRepository) {
        this.projectRepository = projectRepository;
        this.proposalRepository = proposalRepository;
        this.skillRepository = skillRepository;
    }

    public Page<ProjectDto> searchProjects(ProjectStatus status,
                                           String category,
                                           BigDecimal minBudget,
                                           BigDecimal maxBudget,
                                           String query,
                                           Pageable pageable) {
        String cleanCat = (category != null && !category.trim().isEmpty() && !"ALL".equalsIgnoreCase(category)) ? category.trim() : null;
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;

        Page<Project> page = projectRepository.searchProjects(status, cleanCat, minBudget, maxBudget, cleanQuery, pageable);
        return page.map(p -> {
            ProjectDto dto = ProjectDto.fromEntity(p);
            dto.setProposalCount(proposalRepository.findByProjectIdOrderByCreatedAtDesc(p.getId()).size());
            return dto;
        });
    }

    public ProjectDto getProjectById(Long id) {
        Project p = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + id));
        ProjectDto dto = ProjectDto.fromEntity(p);
        dto.setProposalCount(proposalRepository.findByProjectIdOrderByCreatedAtDesc(p.getId()).size());
        return dto;
    }

    public List<ProjectDto> getProjectsByClient(Long clientId) {
        return projectRepository.findByClientIdOrderByCreatedAtDesc(clientId).stream()
                .map(p -> {
                    ProjectDto dto = ProjectDto.fromEntity(p);
                    dto.setProposalCount(proposalRepository.findByProjectIdOrderByCreatedAtDesc(p.getId()).size());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectDto createProject(User user, ProjectCreateDto dto) {
        if (user.getRole().getName() != RoleType.ROLE_CLIENT && user.getRole().getName() != RoleType.ROLE_ADMIN) {
            throw new ForbiddenException("Only clients can post new projects.");
        }

        Project project = new Project();
        project.setClient(user);
        project.setTitle(dto.getTitle().trim());
        project.setCategory(dto.getCategory().trim());
        project.setDescription(dto.getDescription().trim());
        project.setBudget(dto.getBudget());
        project.setDeadline(dto.getDeadline());
        project.setStatus(ProjectStatus.OPEN);

        if (dto.getRequiredSkills() != null) {
            Set<Skill> skills = new HashSet<>();
            for (String sName : dto.getRequiredSkills()) {
                String clean = sName.trim();
                if (!clean.isEmpty()) {
                    Skill s = skillRepository.findByNameIgnoreCase(clean)
                            .orElseGet(() -> skillRepository.save(new Skill(clean)));
                    skills.add(s);
                }
            }
            project.setRequiredSkills(skills);
        }

        Project saved = projectRepository.save(project);
        return ProjectDto.fromEntity(saved);
    }

    @Transactional
    public ProjectDto updateProject(User user, Long id, ProjectCreateDto dto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + id));

        if (!project.getClient().getId().equals(user.getId()) && user.getRole().getName() != RoleType.ROLE_ADMIN) {
            throw new ForbiddenException("You are not authorized to update this project.");
        }

        project.setTitle(dto.getTitle().trim());
        project.setCategory(dto.getCategory().trim());
        project.setDescription(dto.getDescription().trim());
        project.setBudget(dto.getBudget());
        project.setDeadline(dto.getDeadline());

        if (dto.getRequiredSkills() != null) {
            Set<Skill> skills = new HashSet<>();
            for (String sName : dto.getRequiredSkills()) {
                String clean = sName.trim();
                if (!clean.isEmpty()) {
                    Skill s = skillRepository.findByNameIgnoreCase(clean)
                            .orElseGet(() -> skillRepository.save(new Skill(clean)));
                    skills.add(s);
                }
            }
            project.setRequiredSkills(skills);
        }

        Project updated = projectRepository.save(project);
        return ProjectDto.fromEntity(updated);
    }

    @Transactional
    public ProjectDto updateProjectStatus(User user, Long id, ProjectStatus status) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + id));

        if (!project.getClient().getId().equals(user.getId()) && user.getRole().getName() != RoleType.ROLE_ADMIN) {
            throw new ForbiddenException("You are not authorized to change the status of this project.");
        }

        project.setStatus(status);
        Project saved = projectRepository.save(project);
        return ProjectDto.fromEntity(saved);
    }
}
