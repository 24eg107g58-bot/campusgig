package com.campusgig.controller;

import com.campusgig.dto.ApiResponse;
import com.campusgig.dto.FreelanceServiceDto;
import com.campusgig.entity.User;
import com.campusgig.service.AuthService;
import com.campusgig.service.FreelanceServiceService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class FreelanceServiceController {

    private final FreelanceServiceService serviceManager;
    private final AuthService authService;

    public FreelanceServiceController(FreelanceServiceService serviceManager, AuthService authService) {
        this.serviceManager = serviceManager;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<FreelanceServiceDto>>> searchServices(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.success(serviceManager.searchServices(category, query, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FreelanceServiceDto>> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(serviceManager.getServiceById(id)));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<FreelanceServiceDto>>> getServicesByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(serviceManager.getServicesByStudent(studentId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FreelanceServiceDto>> createService(@Valid @RequestBody FreelanceServiceDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Service listing created", serviceManager.createService(user, dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FreelanceServiceDto>> updateService(
            @PathVariable Long id,
            @Valid @RequestBody FreelanceServiceDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Service listing updated", serviceManager.updateService(user, id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteService(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        serviceManager.deleteService(user, id);
        return ResponseEntity.ok(ApiResponse.success("Service listing deleted", null));
    }
}
