package com.campusgig.dto;

import java.util.List;

public class RecommendationDto {
    private StudentProfileDto studentProfile;
    private double matchScore; // 0.0 - 100.0
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String matchExplanation;

    public RecommendationDto() {}

    public RecommendationDto(StudentProfileDto studentProfile, double matchScore, List<String> matchedSkills, List<String> missingSkills, String matchExplanation) {
        this.studentProfile = studentProfile;
        this.matchScore = matchScore;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
        this.matchExplanation = matchExplanation;
    }

    public StudentProfileDto getStudentProfile() {
        return studentProfile;
    }

    public void setStudentProfile(StudentProfileDto studentProfile) {
        this.studentProfile = studentProfile;
    }

    public double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(double matchScore) {
        this.matchScore = matchScore;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public String getMatchExplanation() {
        return matchExplanation;
    }

    public void setMatchExplanation(String matchExplanation) {
        this.matchExplanation = matchExplanation;
    }
}
