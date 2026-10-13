package com.campusgig.controller;

import com.campusgig.dto.ApiResponse;
import com.campusgig.dto.ConversationDto;
import com.campusgig.dto.MessageDto;
import com.campusgig.entity.User;
import com.campusgig.service.AuthService;
import com.campusgig.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final AuthService authService;

    public MessageController(MessageService messageService, AuthService authService) {
        this.messageService = messageService;
        this.authService = authService;
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<ConversationDto>>> getConversations() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(messageService.getConversationsForUser(user)));
    }

    @GetMapping("/user/{otherUserId}")
    public ResponseEntity<ApiResponse<List<MessageDto>>> getMessages(@PathVariable Long otherUserId) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(messageService.getMessages(user, otherUserId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MessageDto>> sendMessage(@Valid @RequestBody MessageDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(messageService.sendMessage(user, dto.getReceiverId(), dto.getContent())));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(Map.of("unreadCount", messageService.getUnreadMessageCount(user.getId()))));
    }

    @MessageMapping("/chat.send")
    public void handleWsMessage(@Payload MessageDto messageDto) {
        // Handled through REST or WebSocket client
    }
}
