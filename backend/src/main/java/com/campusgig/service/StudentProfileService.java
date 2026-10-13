package com.campusgig.service;

import com.campusgig.dto.PortfolioItemDto;
import com.campusgig.dto.StudentProfileDto;
import com.campusgig.entity.PortfolioItem;
import com.campusgig.entity.Skill;
import com.campusgig.entity.StudentProfile;
import com.campusgig.entity.User;
import com.campusgig.enums.RoleType;
import com.campusgig.exception.BadRequestException;
import com.campusgig.exception.ForbiddenException;
import com.campusgig.exception.ResourceNotFoundException;
import com.campusgig.repository.PortfolioItemRepository;
import com.campusgig.repository.SkillRepository;
import com.campusgig.repository.StudentProfileRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;
    private final PortfolioItemRepository portfolioItemRepository;
    private final SkillRepository skillRepository;

    public StudentProfileService(StudentProfileRepository studentProfileRepository,
                                 PortfolioItemRepository portfolioItemRepository,
                                 SkillRepository skillRepository) {
        this.studentProfileRepository = studentProfileRepository;
        this.portfolioItemRepository = portfolioItemRepository;
        this.skillRepository = skillRepository;
    }

    public StudentProfileDto getProfileByUserId(Long userId) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user ID: " + userId));
        return StudentProfileDto.fromEntity(profile);
    }

    @Transactional
    public StudentProfileDto getOrCreateCurrentProfile(User user) {
        if (user.getRole().getName() != RoleType.ROLE_STUDENT) {
            throw new BadRequestException("Only students have a student profile.");
        }
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    StudentProfile p = new StudentProfile();
                    p.setUser(user);
                    return studentProfileRepository.save(p);
                });
        return StudentProfileDto.fromEntity(profile);
    }

    @Transactional
    public StudentProfileDto updateProfile(User user, StudentProfileDto dto) {
        if (user.getRole().getName() != RoleType.ROLE_STUDENT) {
            throw new ForbiddenException("Only students can update a student profile.");
        }

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    StudentProfile p = new StudentProfile();
                    p.setUser(user);
                    return p;
                });

        if (dto.getUniversity() != null) profile.setUniversity(dto.getUniversity().trim());
        if (dto.getDegree() != null) profile.setDegree(dto.getDegree().trim());
        if (dto.getGraduationYear() != null) profile.setGraduationYear(dto.getGraduationYear());
        if (dto.getHourlyRate() != null) profile.setHourlyRate(dto.getHourlyRate());
        if (dto.getGithubUrl() != null) profile.setGithubUrl(dto.getGithubUrl().trim());
        if (dto.getLinkedinUrl() != null) profile.setLinkedinUrl(dto.getLinkedinUrl().trim());
        if (dto.getWebsiteUrl() != null) profile.setWebsiteUrl(dto.getWebsiteUrl().trim());
        if (dto.getExperienceSummary() != null) profile.setExperienceSummary(dto.getExperienceSummary().trim());
        if (dto.getContactPreference() != null) profile.setContactPreference(dto.getContactPreference().trim());

        if (dto.getSkills() != null) {
            Set<Skill> managedSkills = new HashSet<>();
            for (String skillName : dto.getSkills()) {
                String cleanName = skillName.trim();
                if (!cleanName.isEmpty()) {
                    Skill skill = skillRepository.findByNameIgnoreCase(cleanName)
                            .orElseGet(() -> skillRepository.save(new Skill(cleanName)));
                    managedSkills.add(skill);
                }
            }
            profile.setSkills(managedSkills);
        }

        StudentProfile saved = studentProfileRepository.save(profile);
        return StudentProfileDto.fromEntity(saved);
    }

    public Page<StudentProfileDto> searchFreelancers(String query, Pageable pageable) {
        String trimmedQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        Page<StudentProfile> profiles = studentProfileRepository.searchProfiles(trimmedQuery, pageable);
        return profiles.map(StudentProfileDto::fromEntity);
    }

    @Transactional
    public PortfolioItemDto addPortfolioItem(User user, PortfolioItemDto dto) {
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user ID: " + user.getId()));

        PortfolioItem item = new PortfolioItem();
        item.setStudentProfile(profile);
        item.setTitle(dto.getTitle());
        item.setDescription(dto.getDescription());
        item.setProjectUrl(dto.getProjectUrl());
        item.setImageUrl(dto.getImageUrl());
        item.setTags(dto.getTags());

        PortfolioItem saved = portfolioItemRepository.save(item);
        return PortfolioItemDto.fromEntity(saved);
    }

    @Transactional
    public void deletePortfolioItem(User user, Long itemId) {
        PortfolioItem item = portfolioItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio item not found with ID: " + itemId));

        if (!item.getStudentProfile().getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You are not authorized to delete this portfolio item.");
        }

        portfolioItemRepository.delete(item);
    }
}
