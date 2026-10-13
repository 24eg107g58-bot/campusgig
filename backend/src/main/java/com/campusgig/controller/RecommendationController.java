package com.campusgig.controller;

import com.campusgig.dto.ApiResponse;
import com.campusgig.dto.RecommendationDto;
import com.campusgig.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<RecommendationDto>>> getRecommendationsForProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success(recommendationService.getRecommendationsForProject(projectId)));
    }
}
