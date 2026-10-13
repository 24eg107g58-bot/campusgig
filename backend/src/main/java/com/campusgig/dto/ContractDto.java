package com.campusgig.dto;

import com.campusgig.entity.Contract;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class ContractDto {
    private Long id;
    private Long projectId;
    private String projectTitle;
    private Long clientId;
    private String clientName;
    private String clientAvatar;
    private Long studentId;
    private String studentName;
    private String studentAvatar;
    private BigDecimal agreedAmount;
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime completedDate;
    private String notes;
    private List<MilestoneDto> milestones;
    private boolean hasReview;

    public ContractDto() {}

    public static ContractDto fromEntity(Contract c) {
        if (c == null) return null;
        ContractDto dto = new ContractDto();
        dto.setId(c.getId());
        if (c.getProject() != null) {
            dto.setProjectId(c.getProject().getId());
            dto.setProjectTitle(c.getProject().getTitle());
        }
        if (c.getClient() != null) {
            dto.setClientId(c.getClient().getId());
            dto.setClientName(c.getClient().getFullName());
            dto.setClientAvatar(c.getClient().getAvatarUrl());
        }
        if (c.getStudent() != null) {
            dto.setStudentId(c.getStudent().getId());
            dto.setStudentName(c.getStudent().getFullName());
            dto.setStudentAvatar(c.getStudent().getAvatarUrl());
        }
        dto.setAgreedAmount(c.getAgreedAmount());
        dto.setStatus(c.getStatus() != null ? c.getStatus().name() : null);
        dto.setStartDate(c.getStartDate());
        dto.setCompletedDate(c.getCompletedDate());
        dto.setNotes(c.getNotes());
        if (c.getMilestones() != null) {
            dto.setMilestones(c.getMilestones().stream().map(MilestoneDto::fromEntity).collect(Collectors.toList()));
        }
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
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

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentAvatar() {
        return studentAvatar;
    }

    public void setStudentAvatar(String studentAvatar) {
        this.studentAvatar = studentAvatar;
    }

    public BigDecimal getAgreedAmount() {
        return agreedAmount;
    }

    public void setAgreedAmount(BigDecimal agreedAmount) {
        this.agreedAmount = agreedAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getCompletedDate() {
        return completedDate;
    }

    public void setCompletedDate(LocalDateTime completedDate) {
        this.completedDate = completedDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<MilestoneDto> getMilestones() {
        return milestones;
    }

    public void setMilestones(List<MilestoneDto> milestones) {
        this.milestones = milestones;
    }

    public boolean isHasReview() {
        return hasReview;
    }

    public void setHasReview(boolean hasReview) {
        this.hasReview = hasReview;
    }
}
