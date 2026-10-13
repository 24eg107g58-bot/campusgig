package com.campusgig.dto;

import com.campusgig.entity.Proposal;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProposalDto {
    private Long id;
    private Long projectId;
    private String projectTitle;
    private Long studentId;
    private String studentName;
    private String studentAvatar;
    private String studentDegree;
    private String studentUniversity;
    private BigDecimal studentRating;
    private String coverLetter;
    private BigDecimal bidAmount;
    private Integer deliveryDays;
    private String status;
    private LocalDateTime createdAt;

    public ProposalDto() {}

    public static ProposalDto fromEntity(Proposal p) {
        if (p == null) return null;
        ProposalDto dto = new ProposalDto();
        dto.setId(p.getId());
        if (p.getProject() != null) {
            dto.setProjectId(p.getProject().getId());
            dto.setProjectTitle(p.getProject().getTitle());
        }
        if (p.getStudent() != null) {
            dto.setStudentId(p.getStudent().getId());
            dto.setStudentName(p.getStudent().getFullName());
            dto.setStudentAvatar(p.getStudent().getAvatarUrl());
        }
        dto.setCoverLetter(p.getCoverLetter());
        dto.setBidAmount(p.getBidAmount());
        dto.setDeliveryDays(p.getDeliveryDays());
        dto.setStatus(p.getStatus() != null ? p.getStatus().name() : null);
        dto.setCreatedAt(p.getCreatedAt());
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

    public String getStudentDegree() {
        return studentDegree;
    }

    public void setStudentDegree(String studentDegree) {
        this.studentDegree = studentDegree;
    }

    public String getStudentUniversity() {
        return studentUniversity;
    }

    public void setStudentUniversity(String studentUniversity) {
        this.studentUniversity = studentUniversity;
    }

    public BigDecimal getStudentRating() {
        return studentRating;
    }

    public void setStudentRating(BigDecimal studentRating) {
        this.studentRating = studentRating;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public BigDecimal getBidAmount() {
        return bidAmount;
    }

    public void setBidAmount(BigDecimal bidAmount) {
        this.bidAmount = bidAmount;
    }

    public Integer getDeliveryDays() {
        return deliveryDays;
    }

    public void setDeliveryDays(Integer deliveryDays) {
        this.deliveryDays = deliveryDays;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
