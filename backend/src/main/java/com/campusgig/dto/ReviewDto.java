package com.campusgig.dto;

import com.campusgig.entity.Review;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class ReviewDto {
    private Long id;
    private Long contractId;
    private String projectTitle;
    private Long reviewerId;
    private String reviewerName;
    private String reviewerAvatar;
    private Long revieweeId;
    private String revieweeName;
    private Integer rating;
    private String feedback;
    private LocalDateTime createdAt;

    public ReviewDto() {}

    public static ReviewDto fromEntity(Review r) {
        if (r == null) return null;
        ReviewDto dto = new ReviewDto();
        dto.setId(r.getId());
        if (r.getContract() != null) {
            dto.setContractId(r.getContract().getId());
            if (r.getContract().getProject() != null) {
                dto.setProjectTitle(r.getContract().getProject().getTitle());
            }
        }
        if (r.getReviewer() != null) {
            dto.setReviewerId(r.getReviewer().getId());
            dto.setReviewerName(r.getReviewer().getFullName());
            dto.setReviewerAvatar(r.getReviewer().getAvatarUrl());
        }
        if (r.getReviewee() != null) {
            dto.setRevieweeId(r.getReviewee().getId());
            dto.setRevieweeName(r.getReviewee().getFullName());
        }
        dto.setRating(r.getRating());
        dto.setFeedback(r.getFeedback());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public Long getReviewerId() {
        return reviewerId;
    }

    public void setReviewerId(Long reviewerId) {
        this.reviewerId = reviewerId;
    }

    public String getReviewerName() {
        return reviewerName;
    }

    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName;
    }

    public String getReviewerAvatar() {
        return reviewerAvatar;
    }

    public void setReviewerAvatar(String reviewerAvatar) {
        this.reviewerAvatar = reviewerAvatar;
    }

    public Long getRevieweeId() {
        return revieweeId;
    }

    public void setRevieweeId(Long revieweeId) {
        this.revieweeId = revieweeId;
    }

    public String getRevieweeName() {
        return revieweeName;
    }

    public void setRevieweeName(String revieweeName) {
        this.revieweeName = revieweeName;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
