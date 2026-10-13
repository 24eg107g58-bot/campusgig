package com.campusgig.dto;

import com.campusgig.entity.PortfolioItem;
import java.time.LocalDateTime;

public class PortfolioItemDto {
    private Long id;
    private String title;
    private String description;
    private String projectUrl;
    private String imageUrl;
    private String tags;
    private LocalDateTime createdAt;

    public PortfolioItemDto() {}

    public static PortfolioItemDto fromEntity(PortfolioItem item) {
        if (item == null) return null;
        PortfolioItemDto dto = new PortfolioItemDto();
        dto.setId(item.getId());
        dto.setTitle(item.getTitle());
        dto.setDescription(item.getDescription());
        dto.setProjectUrl(item.getProjectUrl());
        dto.setImageUrl(item.getImageUrl());
        dto.setTags(item.getTags());
        dto.setCreatedAt(item.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getProjectUrl() {
        return projectUrl;
    }

    public void setProjectUrl(String projectUrl) {
        this.projectUrl = projectUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
