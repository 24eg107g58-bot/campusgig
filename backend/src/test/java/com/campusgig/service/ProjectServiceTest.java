package com.campusgig.service;

import com.campusgig.dto.ProjectCreateDto;
import com.campusgig.dto.ProjectDto;
import com.campusgig.entity.Project;
import com.campusgig.entity.Role;
import com.campusgig.entity.User;
import com.campusgig.enums.ProjectStatus;
import com.campusgig.enums.RoleType;
import com.campusgig.exception.ForbiddenException;
import com.campusgig.repository.ProjectRepository;
import com.campusgig.repository.ProposalRepository;
import com.campusgig.repository.SkillRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProposalRepository proposalRepository;

    @Mock
    private SkillRepository skillRepository;

    @InjectMocks
    private ProjectService projectService;

    private User clientUser;
    private User studentUser;

    @BeforeEach
    void setUp() {
        Role clientRole = new Role(RoleType.ROLE_CLIENT);
        clientRole.setId(2L);
        clientUser = new User();
        clientUser.setId(10L);
        clientUser.setEmail("client@test.com");
        clientUser.setFullName("Test Client");
        clientUser.setRole(clientRole);

        Role studentRole = new Role(RoleType.ROLE_STUDENT);
        studentRole.setId(1L);
        studentUser = new User();
        studentUser.setId(20L);
        studentUser.setEmail("student@test.com");
        studentUser.setFullName("Test Student");
        studentUser.setRole(studentRole);
    }

    @Test
    void createProject_AsClient_ShouldSucceed() {
        ProjectCreateDto dto = new ProjectCreateDto();
        dto.setTitle("Campus Marketplace App");
        dto.setCategory("Web Development");
        dto.setDescription("Build marketplace with React and Spring Boot");
        dto.setBudget(new BigDecimal("500.00"));
        dto.setDeadline(LocalDate.now().plusDays(14));
        dto.setRequiredSkills(Set.of("React.js", "Java"));

        Project savedProject = new Project();
        savedProject.setId(1L);
        savedProject.setClient(clientUser);
        savedProject.setTitle(dto.getTitle());
        savedProject.setCategory(dto.getCategory());
        savedProject.setDescription(dto.getDescription());
        savedProject.setBudget(dto.getBudget());
        savedProject.setStatus(ProjectStatus.OPEN);

        when(projectRepository.save(any(Project.class))).thenReturn(savedProject);

        ProjectDto result = projectService.createProject(clientUser, dto);

        assertNotNull(result);
        assertEquals("Campus Marketplace App", result.getTitle());
        assertEquals(ProjectStatus.OPEN.name(), result.getStatus());
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    void createProject_AsStudent_ShouldThrowForbidden() {
        ProjectCreateDto dto = new ProjectCreateDto();
        dto.setTitle("Illegal Project");
        dto.setCategory("Web Development");
        dto.setDescription("Should fail");
        dto.setBudget(new BigDecimal("200.00"));

        assertThrows(ForbiddenException.class, () -> projectService.createProject(studentUser, dto));
        verify(projectRepository, never()).save(any(Project.class));
    }

    @Test
    void getProjectById_WhenExists_ShouldReturnProject() {
        Project project = new Project();
        project.setId(1L);
        project.setClient(clientUser);
        project.setTitle("Existing Project");
        project.setBudget(new BigDecimal("300.00"));
        project.setStatus(ProjectStatus.OPEN);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(proposalRepository.findByProjectIdOrderByCreatedAtDesc(1L)).thenReturn(Collections.emptyList());

        ProjectDto result = projectService.getProjectById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Existing Project", result.getTitle());
    }
}
