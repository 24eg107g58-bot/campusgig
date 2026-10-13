package com.campusgig.dto;

import com.campusgig.entity.Project;
import com.campusgig.entity.Skill;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public class ProjectDto {
    private Long id;
    private Long clientId;
    private String clientName;
    private String clientAvatar;
    private String title;
    private String category;
    private String description;
    private BigDecimal budget;
    private LocalDate deadline;
    private String status;
    private Set<String> requiredSkills;
    private int proposalCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProjectDto() {}

    public static ProjectDto fromEntity(Project p) {
        if (p == null) return null;
        ProjectDto dto = new ProjectDto();
        dto.setId(p.getId());
        if (p.getClient() != null) {
            dto.setClientId(p.getClient().getId());
            dto.setClientName(p.getClient().getFullName());
            dto.setClientAvatar(p.getClient().getAvatarUrl());
        }
        dto.setTitle(p.getTitle());
        dto.setCategory(p.getCategory());
        dto.setDescription(p.getDescription());
        dto.setBudget(p.getBudget());
        dto.setDeadline(p.getDeadline());
        dto.setStatus(p.getStatus() != null ? p.getStatus().name() : null);
        if (p.getRequiredSkills() != null) {
            dto.setRequiredSkills(p.getRequiredSkills().stream().map(Skill::getName).collect(Collectors.toSet()));
        }
        dto.setCreatedAt(p.getCreatedAt());
        dto.setUpdatedAt(p.getUpdatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getClientAvatar() {
        return clientAvatar;
    }

    public void setClientAvatar(String clientAvatar) {
        this.clientAvatar = clientAvatar;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<String> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(Set<String> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public int getProposalCount() {
        return proposalCount;
    }

    public void setProposalCount(int proposalCount) {
        this.proposalCount = proposalCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
