package com.campusgig.controller;

import com.campusgig.dto.AiChatRequest;
import com.campusgig.dto.AiChatResponse;
import com.campusgig.dto.ApiResponse;
import com.campusgig.service.AiChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiChatController {

    private final AiChatService aiChatService;

    public AiChatController(AiChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(@Valid @RequestBody AiChatRequest request) {
        return ResponseEntity.ok(ApiResponse.success(aiChatService.getChatResponse(request)));
    }
}
