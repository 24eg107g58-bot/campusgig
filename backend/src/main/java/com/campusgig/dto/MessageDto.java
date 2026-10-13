package com.campusgig.dto;

import com.campusgig.entity.Message;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class MessageDto {
    private Long id;
    private Long conversationId;
    private Long senderId;
    private String senderName;
    private String senderAvatar;
    private Long receiverId;
    private String receiverName;

    @NotBlank(message = "Message content cannot be blank")
    private String content;

    private boolean isRead;
    private LocalDateTime createdAt;

    public MessageDto() {}

    public static MessageDto fromEntity(Message m) {
        if (m == null) return null;
        MessageDto dto = new MessageDto();
        dto.setId(m.getId());
        if (m.getConversation() != null) {
            dto.setConversationId(m.getConversation().getId());
        }
        if (m.getSender() != null) {
            dto.setSenderId(m.getSender().getId());
            dto.setSenderName(m.getSender().getFullName());
            dto.setSenderAvatar(m.getSender().getAvatarUrl());
        }
        if (m.getReceiver() != null) {
            dto.setReceiverId(m.getReceiver().getId());
            dto.setReceiverName(m.getReceiver().getFullName());
        }
        dto.setContent(m.getContent());
        dto.setRead(m.isRead());
        dto.setCreatedAt(m.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSenderAvatar() {
        return senderAvatar;
    }

    public void setSenderAvatar(String senderAvatar) {
        this.senderAvatar = senderAvatar;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
