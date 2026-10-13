package com.campusgig.controller;

import com.campusgig.dto.ApiResponse;
import com.campusgig.dto.UserDto;
import com.campusgig.entity.User;
import com.campusgig.service.AuthService;
import com.campusgig.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    public UserController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(@RequestBody UserDto dto) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        UserDto updated = userService.updateProfile(currentUser, dto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(@RequestBody Map<String, String> payload) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");
        userService.changePassword(currentUser, currentPassword, newPassword);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }
}
