package com.campusgig.controller;

import com.campusgig.dto.ApiResponse;
import com.campusgig.dto.ReviewCreateDto;
import com.campusgig.dto.ReviewDto;
import com.campusgig.entity.User;
import com.campusgig.service.AuthService;
import com.campusgig.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final AuthService authService;

    public ReviewController(ReviewService reviewService, AuthService authService) {
        this.reviewService = reviewService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewDto>> createReview(@Valid @RequestBody ReviewCreateDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Review submitted successfully", reviewService.createReview(user, dto)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getReviewsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getReviewsForUser(userId)));
    }

    @GetMapping("/contract/{contractId}")
    public ResponseEntity<ApiResponse<ReviewDto>> getReviewForContract(@PathVariable Long contractId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getReviewForContract(contractId)));
    }
}
