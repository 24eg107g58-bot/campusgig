package com.campusgig.service;

import com.campusgig.dto.UserDto;
import com.campusgig.entity.User;
import com.campusgig.exception.BadRequestException;
import com.campusgig.exception.ResourceNotFoundException;
import com.campusgig.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return UserDto.fromEntity(user);
    }

    @Transactional
    public UserDto updateProfile(User currentUser, UserDto updateDto) {
        if (updateDto.getFullName() != null && !updateDto.getFullName().isBlank()) {
            currentUser.setFullName(updateDto.getFullName().trim());
        }
        if (updateDto.getPhone() != null) {
            currentUser.setPhone(updateDto.getPhone().trim());
        }
        if (updateDto.getBio() != null) {
            currentUser.setBio(updateDto.getBio().trim());
        }
        if (updateDto.getAvatarUrl() != null) {
            currentUser.setAvatarUrl(updateDto.getAvatarUrl().trim());
        }
        User updated = userRepository.save(currentUser);
        return UserDto.fromEntity(updated);
    }

    @Transactional
    public void changePassword(User currentUser, String currentPassword, String newPassword) {
        if (!passwordEncoder.matches(currentPassword, currentUser.getPassword())) {
            throw new BadRequestException("Current password does not match.");
        }
        if (newPassword == null || newPassword.length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters long.");
        }
        currentUser.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(currentUser);
    }
}
