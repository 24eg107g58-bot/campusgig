package com.campusgig.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ProposalCreateDto {

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotBlank(message = "Cover letter is required")
    private String coverLetter;

    @NotNull(message = "Bid amount is required")
    @DecimalMin(value = "5.00", message = "Bid amount must be at least 5.00")
    private BigDecimal bidAmount;

    @NotNull(message = "Delivery estimate in days is required")
    @Min(value = 1, message = "Delivery estimate must be at least 1 day")
    private Integer deliveryDays;

    public ProposalCreateDto() {}

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
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
}
