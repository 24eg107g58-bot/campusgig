package com.campusgig.service;

import com.campusgig.dto.RecommendationDto;
import com.campusgig.dto.StudentProfileDto;
import com.campusgig.entity.Project;
import com.campusgig.entity.Skill;
import com.campusgig.entity.StudentProfile;
import com.campusgig.exception.ResourceNotFoundException;
import com.campusgig.repository.ProjectRepository;
import com.campusgig.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final ProjectRepository projectRepository;
    private final StudentProfileRepository studentProfileRepository;

    public RecommendationService(ProjectRepository projectRepository,
                                 StudentProfileRepository studentProfileRepository) {
        this.projectRepository = projectRepository;
        this.studentProfileRepository = studentProfileRepository;
    }

    public List<RecommendationDto> getRecommendationsForProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + projectId));

        Set<String> requiredSkillNames = project.getRequiredSkills() != null
                ? project.getRequiredSkills().stream()
                    .map(s -> s.getName().trim().toLowerCase())
                    .collect(Collectors.toSet())
                : Collections.emptySet();

        List<StudentProfile> allProfiles = studentProfileRepository.findAll();
        List<RecommendationDto> recommendations = new ArrayList<>();

        for (StudentProfile profile : allProfiles) {
            Set<String> studentSkillNames = profile.getSkills() != null
                    ? profile.getSkills().stream()
                        .map(s -> s.getName().trim().toLowerCase())
                        .collect(Collectors.toSet())
                    : Collections.emptySet();

            List<String> matched = new ArrayList<>();
            List<String> missing = new ArrayList<>();

            if (!requiredSkillNames.isEmpty()) {
                for (Skill reqSkill : project.getRequiredSkills()) {
                    String lowerReq = reqSkill.getName().trim().toLowerCase();
                    if (studentSkillNames.contains(lowerReq)) {
                        matched.add(reqSkill.getName());
                    } else {
                        missing.add(reqSkill.getName());
                    }
                }
            } else {
                // If no specific skills required, list student's top skills
                if (profile.getSkills() != null) {
                    matched = profile.getSkills().stream().map(Skill::getName).limit(5).collect(Collectors.toList());
                }
            }

            double skillFraction = requiredSkillNames.isEmpty() ? 0.70 : (double) matched.size() / requiredSkillNames.size();
            double ratingFactor = (profile.getRatingAvg() != null ? profile.getRatingAvg().doubleValue() : 0.0) / 5.0;
            double score = Math.min(100.0, Math.round((skillFraction * 80.0 + ratingFactor * 20.0) * 10.0) / 10.0);

            // Skip zero skill matches if skills were required
            if (!requiredSkillNames.isEmpty() && matched.isEmpty()) {
                continue;
            }

            StringBuilder explanation = new StringBuilder();
            if (!requiredSkillNames.isEmpty()) {
                explanation.append("Matches ").append(matched.size()).append(" of ").append(requiredSkillNames.size())
                           .append(" required skills (").append(String.join(", ", matched)).append("). ");
                if (!missing.isEmpty()) {
                    explanation.append("Pending skills: ").append(String.join(", ", missing)).append(". ");
                }
            } else {
                explanation.append("Broad skill fit with strong general profile skills: ")
                           .append(String.join(", ", matched)).append(". ");
            }

            if (profile.getRatingAvg() != null && profile.getRatingAvg().compareTo(BigDecimal.ZERO) > 0) {
                explanation.append("Has a high client satisfaction rating of ")
                           .append(profile.getRatingAvg().setScale(1, RoundingMode.HALF_UP))
                           .append("★ across ").append(profile.getReviewCount()).append(" reviews.");
            }

            RecommendationDto dto = new RecommendationDto(
                    StudentProfileDto.fromEntity(profile),
                    score,
                    matched,
                    missing,
                    explanation.toString()
            );
            recommendations.add(dto);
        }

        // Sort descending by match score
        recommendations.sort(Comparator.comparingDouble(RecommendationDto::getMatchScore).reversed());
        return recommendations;
    }
}
