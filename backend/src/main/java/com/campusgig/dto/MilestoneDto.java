package com.campusgig.dto;

import com.campusgig.entity.Milestone;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class MilestoneDto {
    private Long id;
    private Long contractId;
    private String title;
    private String description;
    private BigDecimal amount;
    private String status;
    private LocalDate dueDate;
    private LocalDateTime updatedAt;

    public MilestoneDto() {}

    public static MilestoneDto fromEntity(Milestone m) {
        if (m == null) return null;
        MilestoneDto dto = new MilestoneDto();
        dto.setId(m.getId());
        if (m.getContract() != null) {
            dto.setContractId(m.getContract().getId());
        }
        dto.setTitle(m.getTitle());
        dto.setDescription(m.getDescription());
        dto.setAmount(m.getAmount());
        dto.setStatus(m.getStatus());
        dto.setDueDate(m.getDueDate());
        dto.setUpdatedAt(m.getUpdatedAt());
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
