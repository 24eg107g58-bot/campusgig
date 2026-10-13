package com.campusgig.controller;

import com.campusgig.dto.ApiResponse;
import com.campusgig.dto.ProjectCreateDto;
import com.campusgig.dto.ProjectDto;
import com.campusgig.entity.User;
import com.campusgig.enums.ProjectStatus;
import com.campusgig.service.AuthService;
import com.campusgig.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final AuthService authService;

    public ProjectController(ProjectService projectService, AuthService authService) {
        this.projectService = projectService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProjectDto>>> searchProjects(
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minBudget,
            @RequestParam(required = false) BigDecimal maxBudget,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.success(
                projectService.searchProjects(status, category, minBudget, maxBudget, query, pageable)
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(projectService.getProjectById(id)));
    }

    @GetMapping("/client/me")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getMyClientProjects() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(projectService.getProjectsByClient(user.getId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectDto>> createProject(@Valid @RequestBody ProjectCreateDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Project created successfully", projectService.createProject(user, dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectCreateDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", projectService.updateProject(user, id, dto)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ProjectDto>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        User user = authService.getCurrentAuthenticatedUser();
        ProjectStatus status = ProjectStatus.valueOf(payload.get("status").toUpperCase());
        return ResponseEntity.ok(ApiResponse.success("Status updated", projectService.updateProjectStatus(user, id, status)));
    }
}
