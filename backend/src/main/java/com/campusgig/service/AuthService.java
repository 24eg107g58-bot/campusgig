package com.campusgig.service;

import com.campusgig.config.JwtTokenProvider;
import com.campusgig.dto.AuthResponse;
import com.campusgig.dto.LoginRequest;
import com.campusgig.dto.RegisterRequest;
import com.campusgig.dto.UserDto;
import com.campusgig.entity.Role;
import com.campusgig.entity.StudentProfile;
import com.campusgig.entity.User;
import com.campusgig.enums.RoleType;
import com.campusgig.exception.BadRequestException;
import com.campusgig.exception.UnauthorizedException;
import com.campusgig.repository.RoleRepository;
import com.campusgig.repository.StudentProfileRepository;
import com.campusgig.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       RoleRepository roleRepository,
                       StudentProfileRepository studentProfileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().getName().name());
        return new AuthResponse(token, UserDto.fromEntity(user));
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with email " + email + " already exists.");
        }

        RoleType roleType;
        try {
            roleType = RoleType.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new BadRequestException("Invalid role specified. Must be ROLE_STUDENT or ROLE_CLIENT.");
        }

        if (roleType == RoleType.ROLE_ADMIN) {
            throw new BadRequestException("Registration for administrator role is not permitted.");
        }

        Role role = roleRepository.findByName(roleType)
                .orElseGet(() -> roleRepository.save(new Role(roleType)));

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone());
        user.setBio(request.getBio());
        user.setRole(role);
        user.setEnabled(true);

        User savedUser = userRepository.save(user);

        if (roleType == RoleType.ROLE_STUDENT) {
            StudentProfile profile = new StudentProfile();
            profile.setUser(savedUser);
            profile.setUniversity(request.getUniversity() != null ? request.getUniversity() : "University Student");
            profile.setDegree(request.getDegree() != null ? request.getDegree() : "Undergraduate");
            profile.setGraduationYear(request.getGraduationYear() != null ? request.getGraduationYear() : 2026);
            studentProfileRepository.save(profile);
        }

        String token = tokenProvider.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole().getName().name());
        return new AuthResponse(token, UserDto.fromEntity(savedUser));
    }

    public User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedException("User is not authenticated.");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found."));
    }
}
