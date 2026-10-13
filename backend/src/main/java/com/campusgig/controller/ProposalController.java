package com.campusgig.controller;

import com.campusgig.dto.ApiResponse;
import com.campusgig.dto.ProposalCreateDto;
import com.campusgig.dto.ProposalDto;
import com.campusgig.entity.User;
import com.campusgig.service.AuthService;
import com.campusgig.service.ProposalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proposals")
public class ProposalController {

    private final ProposalService proposalService;
    private final AuthService authService;

    public ProposalController(ProposalService proposalService, AuthService authService) {
        this.proposalService = proposalService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProposalDto>> submitProposal(@Valid @RequestBody ProposalCreateDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Proposal submitted successfully", proposalService.submitProposal(user, dto)));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<ProposalDto>>> getProposalsForProject(@PathVariable Long projectId) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(proposalService.getProposalsForProject(user, projectId)));
    }

    @GetMapping("/student/me")
    public ResponseEntity<ApiResponse<List<ProposalDto>>> getMyStudentProposals() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(proposalService.getProposalsByStudent(user)));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<ProposalDto>> acceptProposal(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Proposal accepted and contract established", proposalService.acceptProposal(user, id)));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<ProposalDto>> rejectProposal(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Proposal rejected", proposalService.rejectProposal(user, id)));
    }
}
