package com.campusgig.service;

import com.campusgig.dto.ReviewCreateDto;
import com.campusgig.dto.ReviewDto;
import com.campusgig.entity.Contract;
import com.campusgig.entity.Notification;
import com.campusgig.entity.Review;
import com.campusgig.entity.User;
import com.campusgig.enums.ContractStatus;
import com.campusgig.enums.NotificationType;
import com.campusgig.enums.RoleType;
import com.campusgig.exception.BadRequestException;
import com.campusgig.exception.ForbiddenException;
import com.campusgig.exception.ResourceNotFoundException;
import com.campusgig.repository.ContractRepository;
import com.campusgig.repository.NotificationRepository;
import com.campusgig.repository.ReviewRepository;
import com.campusgig.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ContractRepository contractRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final NotificationRepository notificationRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ContractRepository contractRepository,
                         StudentProfileRepository studentProfileRepository,
                         NotificationRepository notificationRepository) {
        this.reviewRepository = reviewRepository;
        this.contractRepository = contractRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.notificationRepository = notificationRepository;
    }

    public List<ReviewDto> getReviewsForUser(Long userId) {
        return reviewRepository.findByRevieweeIdOrderByCreatedAtDesc(userId).stream()
                .map(ReviewDto::fromEntity)
                .collect(Collectors.toList());
    }

    public ReviewDto getReviewForContract(Long contractId) {
        return reviewRepository.findByContractId(contractId)
                .map(ReviewDto::fromEntity)
                .orElse(null);
    }

    @Transactional
    public ReviewDto createReview(User currentUser, ReviewCreateDto dto) {
        Contract contract = contractRepository.findById(dto.getContractId())
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with ID: " + dto.getContractId()));

        if (!contract.getClient().getId().equals(currentUser.getId()) && currentUser.getRole().getName() != RoleType.ROLE_ADMIN) {
            throw new ForbiddenException("Only the project client can submit a review.");
        }

        if (contract.getStatus() != ContractStatus.COMPLETED) {
            throw new BadRequestException("Reviews can only be submitted for completed contracts.");
        }

        if (reviewRepository.existsByContractId(contract.getId())) {
            throw new BadRequestException("A review has already been submitted for this contract.");
        }

        Review review = new Review();
        review.setContract(contract);
        review.setReviewer(currentUser);
        review.setReviewee(contract.getStudent());
        review.setRating(dto.getRating());
        review.setFeedback(dto.getFeedback() != null ? dto.getFeedback().trim() : "");

        Review saved = reviewRepository.save(review);

        // Update StudentProfile rating_avg and review_count
        studentProfileRepository.findByUserId(contract.getStudent().getId()).ifPresent(sp -> {
            Double avg = reviewRepository.calculateAverageRating(contract.getStudent().getId());
            Long count = reviewRepository.countReviewsForUser(contract.getStudent().getId());
            if (avg != null) {
                sp.setRatingAvg(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
            }
            if (count != null) {
                sp.setReviewCount(count.intValue());
            }
            studentProfileRepository.save(sp);
        });

        // Notify student
        Notification notif = new Notification(
                contract.getStudent(),
                "New Review Received!",
                currentUser.getFullName() + " left you a " + dto.getRating() + "-star review for \"" + contract.getProject().getTitle() + "\".",
                NotificationType.REVIEW,
                saved.getId()
        );
        notificationRepository.save(notif);

        return ReviewDto.fromEntity(saved);
    }
}
