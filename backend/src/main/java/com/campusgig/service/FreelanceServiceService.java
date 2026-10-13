package com.campusgig.service;

import com.campusgig.dto.FreelanceServiceDto;
import com.campusgig.entity.FreelanceService;
import com.campusgig.entity.User;
import com.campusgig.enums.RoleType;
import com.campusgig.exception.ForbiddenException;
import com.campusgig.exception.ResourceNotFoundException;
import com.campusgig.repository.FreelanceServiceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FreelanceServiceService {

    private final FreelanceServiceRepository freelanceServiceRepository;

    public FreelanceServiceService(FreelanceServiceRepository freelanceServiceRepository) {
        this.freelanceServiceRepository = freelanceServiceRepository;
    }

    public Page<FreelanceServiceDto> searchServices(String category, String query, Pageable pageable) {
        String cleanCat = (category != null && !category.trim().isEmpty() && !"ALL".equalsIgnoreCase(category)) ? category.trim() : null;
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        return freelanceServiceRepository.searchServices(cleanCat, cleanQuery, pageable)
                .map(FreelanceServiceDto::fromEntity);
    }

    public FreelanceServiceDto getServiceById(Long id) {
        FreelanceService fs = freelanceServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Freelance service not found with ID: " + id));
        return FreelanceServiceDto.fromEntity(fs);
    }

    public List<FreelanceServiceDto> getServicesByStudent(Long studentId) {
        return freelanceServiceRepository.findByStudentId(studentId).stream()
                .map(FreelanceServiceDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public FreelanceServiceDto createService(User user, FreelanceServiceDto dto) {
        if (user.getRole().getName() != RoleType.ROLE_STUDENT) {
            throw new ForbiddenException("Only students can create freelance service listings.");
        }

        FreelanceService fs = new FreelanceService();
        fs.setStudent(user);
        fs.setTitle(dto.getTitle().trim());
        fs.setCategory(dto.getCategory().trim());
        fs.setDescription(dto.getDescription().trim());
        fs.setPrice(dto.getPrice());
        fs.setDeliveryDays(dto.getDeliveryDays());
        fs.setActive(dto.isActive());

        FreelanceService saved = freelanceServiceRepository.save(fs);
        return FreelanceServiceDto.fromEntity(saved);
    }

    @Transactional
    public FreelanceServiceDto updateService(User user, Long id, FreelanceServiceDto dto) {
        FreelanceService fs = freelanceServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Freelance service not found with ID: " + id));

        if (!fs.getStudent().getId().equals(user.getId()) && user.getRole().getName() != RoleType.ROLE_ADMIN) {
            throw new ForbiddenException("You are not authorized to update this service listing.");
        }

        fs.setTitle(dto.getTitle().trim());
        fs.setCategory(dto.getCategory().trim());
        fs.setDescription(dto.getDescription().trim());
        fs.setPrice(dto.getPrice());
        fs.setDeliveryDays(dto.getDeliveryDays());
        fs.setActive(dto.isActive());

        FreelanceService updated = freelanceServiceRepository.save(fs);
        return FreelanceServiceDto.fromEntity(updated);
    }

    @Transactional
    public void deleteService(User user, Long id) {
        FreelanceService fs = freelanceServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Freelance service not found with ID: " + id));

        if (!fs.getStudent().getId().equals(user.getId()) && user.getRole().getName() != RoleType.ROLE_ADMIN) {
            throw new ForbiddenException("You are not authorized to delete this service listing.");
        }

        freelanceServiceRepository.delete(fs);
    }
}
