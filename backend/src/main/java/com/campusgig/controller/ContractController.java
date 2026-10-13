package com.campusgig.controller;

import com.campusgig.dto.ApiResponse;
import com.campusgig.dto.ContractDto;
import com.campusgig.dto.MilestoneDto;
import com.campusgig.entity.User;
import com.campusgig.enums.ContractStatus;
import com.campusgig.service.AuthService;
import com.campusgig.service.ContractService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    private final ContractService contractService;
    private final AuthService authService;

    public ContractController(ContractService contractService, AuthService authService) {
        this.contractService = contractService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ContractDto>>> getMyContracts() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(contractService.getContractsForUser(user)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContractDto>> getContractById(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(contractService.getContractById(id, user)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ContractDto>> updateContractStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        User user = authService.getCurrentAuthenticatedUser();
        ContractStatus status = ContractStatus.valueOf(payload.get("status").toUpperCase());
        return ResponseEntity.ok(ApiResponse.success("Contract status updated", contractService.updateContractStatus(user, id, status)));
    }

    @PostMapping("/{id}/milestones")
    public ResponseEntity<ApiResponse<MilestoneDto>> addMilestone(
            @PathVariable Long id,
            @RequestBody MilestoneDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Milestone created", contractService.addMilestone(user, id, dto)));
    }

    @PatchMapping("/milestones/{milestoneId}/status")
    public ResponseEntity<ApiResponse<MilestoneDto>> updateMilestoneStatus(
            @PathVariable Long milestoneId,
            @RequestBody Map<String, String> payload) {
        User user = authService.getCurrentAuthenticatedUser();
        String status = payload.get("status");
        return ResponseEntity.ok(ApiResponse.success("Milestone status updated", contractService.updateMilestoneStatus(user, milestoneId, status)));
    }
}
