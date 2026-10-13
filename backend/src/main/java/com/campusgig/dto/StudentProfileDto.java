package com.campusgig.dto;

import com.campusgig.entity.Skill;
import com.campusgig.entity.StudentProfile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class StudentProfileDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String bio;
    private String avatarUrl;
    private String phone;
    private String university;
    private String degree;
    private Integer graduationYear;
    private BigDecimal hourlyRate;
    private String githubUrl;
    private String linkedinUrl;
    private String websiteUrl;
    private String experienceSummary;
    private String contactPreference;
    private BigDecimal ratingAvg;
    private Integer reviewCount;
    private BigDecimal totalEarned;
    private Integer completedProjects;
    private Set<String> skills;
    private List<PortfolioItemDto> portfolioItems;

    public StudentProfileDto() {}

    public static StudentProfileDto fromEntity(StudentProfile p) {
        if (p == null) return null;
        StudentProfileDto dto = new StudentProfileDto();
        dto.setId(p.getId());
        if (p.getUser() != null) {
            dto.setUserId(p.getUser().getId());
            dto.setFullName(p.getUser().getFullName());
            dto.setEmail(p.getUser().getEmail());
            dto.setBio(p.getUser().getBio());
            dto.setAvatarUrl(p.getUser().getAvatarUrl());
            dto.setPhone(p.getUser().getPhone());
        }
        dto.setUniversity(p.getUniversity());
        dto.setDegree(p.getDegree());
        dto.setGraduationYear(p.getGraduationYear());
        dto.setHourlyRate(p.getHourlyRate());
        dto.setGithubUrl(p.getGithubUrl());
        dto.setLinkedinUrl(p.getLinkedinUrl());
        dto.setWebsiteUrl(p.getWebsiteUrl());
        dto.setExperienceSummary(p.getExperienceSummary());
        dto.setContactPreference(p.getContactPreference());
        dto.setRatingAvg(p.getRatingAvg());
        dto.setReviewCount(p.getReviewCount());
        dto.setTotalEarned(p.getTotalEarned());
        dto.setCompletedProjects(p.getCompletedProjects());

        if (p.getSkills() != null) {
            dto.setSkills(p.getSkills().stream().map(Skill::getName).collect(Collectors.toSet()));
        }
        if (p.getPortfolioItems() != null) {
            dto.setPortfolioItems(p.getPortfolioItems().stream().map(PortfolioItemDto::fromEntity).collect(Collectors.toList()));
        }
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public Integer getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(Integer graduationYear) {
        this.graduationYear = graduationYear;
    }

    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(BigDecimal hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public String getExperienceSummary() {
        return experienceSummary;
    }

    public void setExperienceSummary(String experienceSummary) {
        this.experienceSummary = experienceSummary;
    }

    public String getContactPreference() {
        return contactPreference;
    }

    public void setContactPreference(String contactPreference) {
        this.contactPreference = contactPreference;
    }

    public BigDecimal getRatingAvg() {
        return ratingAvg;
    }

    public void setRatingAvg(BigDecimal ratingAvg) {
        this.ratingAvg = ratingAvg;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public BigDecimal getTotalEarned() {
        return totalEarned;
    }

    public void setTotalEarned(BigDecimal totalEarned) {
        this.totalEarned = totalEarned;
    }

    public Integer getCompletedProjects() {
        return completedProjects;
    }

    public void setCompletedProjects(Integer completedProjects) {
        this.completedProjects = completedProjects;
    }

    public Set<String> getSkills() {
        return skills;
    }

    public void setSkills(Set<String> skills) {
        this.skills = skills;
    }

    public List<PortfolioItemDto> getPortfolioItems() {
        return portfolioItems;
    }

    public void setPortfolioItems(List<PortfolioItemDto> portfolioItems) {
        this.portfolioItems = portfolioItems;
    }
}
