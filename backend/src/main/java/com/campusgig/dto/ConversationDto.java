package com.campusgig.dto;

import com.campusgig.entity.Conversation;
import com.campusgig.entity.User;
import java.time.LocalDateTime;

public class ConversationDto {
    private Long id;
    private Long otherUserId;
    private String otherUserName;
    private String otherUserAvatar;
    private String otherUserRole;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private long unreadCount;

    public ConversationDto() {}

    public static ConversationDto fromEntity(Conversation c, Long currentUserId, String lastMessage, long unreadCount) {
        if (c == null) return null;
        ConversationDto dto = new ConversationDto();
        dto.setId(c.getId());
        User other = c.getUserOne().getId().equals(currentUserId) ? c.getUserTwo() : c.getUserOne();
        dto.setOtherUserId(other.getId());
        dto.setOtherUserName(other.getFullName());
        dto.setOtherUserAvatar(other.getAvatarUrl());
        dto.setOtherUserRole(other.getRole() != null ? other.getRole().getName().name() : null);
        dto.setLastMessage(lastMessage);
        dto.setLastMessageAt(c.getLastMessageAt());
        dto.setUnreadCount(unreadCount);
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOtherUserId() {
        return otherUserId;
    }

    public void setOtherUserId(Long otherUserId) {
        this.otherUserId = otherUserId;
    }

    public String getOtherUserName() {
        return otherUserName;
    }

    public void setOtherUserName(String otherUserName) {
        this.otherUserName = otherUserName;
    }

    public String getOtherUserAvatar() {
        return otherUserAvatar;
    }

    public void setOtherUserAvatar(String otherUserAvatar) {
        this.otherUserAvatar = otherUserAvatar;
    }

    public String getOtherUserRole() {
        return otherUserRole;
    }

    public void setOtherUserRole(String otherUserRole) {
        this.otherUserRole = otherUserRole;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public LocalDateTime getLastMessageAt() {
        return lastMessageAt;
    }

    public void setLastMessageAt(LocalDateTime lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }

    public long getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(long unreadCount) {
        this.unreadCount = unreadCount;
    }
}
