package com.campusgig.controller;

import com.campusgig.dto.ApiResponse;
import com.campusgig.dto.PortfolioItemDto;
import com.campusgig.dto.StudentProfileDto;
import com.campusgig.entity.User;
import com.campusgig.service.AuthService;
import com.campusgig.service.StudentProfileService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
public class StudentProfileController {

    private final StudentProfileService profileService;
    private final AuthService authService;

    public StudentProfileController(StudentProfileService profileService, AuthService authService) {
        this.profileService = profileService;
        this.authService = authService;
    }

    @GetMapping("/freelancers")
    public ResponseEntity<ApiResponse<Page<StudentProfileDto>>> searchFreelancers(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("ratingAvg").descending());
        return ResponseEntity.ok(ApiResponse.success(profileService.searchFreelancers(query, pageable)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getProfileByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(profileService.getProfileByUserId(userId)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getMyProfile() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(profileService.getOrCreateCurrentProfile(user)));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<StudentProfileDto>> updateMyProfile(@RequestBody StudentProfileDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profileService.updateProfile(user, dto)));
    }

    @PostMapping("/portfolio")
    public ResponseEntity<ApiResponse<PortfolioItemDto>> addPortfolioItem(@RequestBody PortfolioItemDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Portfolio item added", profileService.addPortfolioItem(user, dto)));
    }

    @DeleteMapping("/portfolio/{itemId}")
    public ResponseEntity<ApiResponse<String>> deletePortfolioItem(@PathVariable Long itemId) {
        User user = authService.getCurrentAuthenticatedUser();
        profileService.deletePortfolioItem(user, itemId);
        return ResponseEntity.ok(ApiResponse.success("Portfolio item deleted", null));
    }
}
