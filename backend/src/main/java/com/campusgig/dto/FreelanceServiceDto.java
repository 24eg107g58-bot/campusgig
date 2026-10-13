package com.campusgig.dto;

import com.campusgig.entity.FreelanceService;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class FreelanceServiceDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentAvatar;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "1.00", message = "Price must be at least 1.00")
    private BigDecimal price;

    @NotNull(message = "Delivery days is required")
    @Min(value = 1, message = "Delivery days must be at least 1")
    private Integer deliveryDays;

    private boolean active = true;
    private LocalDateTime createdAt;

    public FreelanceServiceDto() {}

    public static FreelanceServiceDto fromEntity(FreelanceService fs) {
        if (fs == null) return null;
        FreelanceServiceDto dto = new FreelanceServiceDto();
        dto.setId(fs.getId());
        if (fs.getStudent() != null) {
            dto.setStudentId(fs.getStudent().getId());
            dto.setStudentName(fs.getStudent().getFullName());
            dto.setStudentAvatar(fs.getStudent().getAvatarUrl());
        }
        dto.setTitle(fs.getTitle());
        dto.setCategory(fs.getCategory());
        dto.setDescription(fs.getDescription());
        dto.setPrice(fs.getPrice());
        dto.setDeliveryDays(fs.getDeliveryDays());
        dto.setActive(fs.isActive());
        dto.setCreatedAt(fs.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getDeliveryDays() {
        return deliveryDays;
    }

    public void setDeliveryDays(Integer deliveryDays) {
        this.deliveryDays = deliveryDays;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
