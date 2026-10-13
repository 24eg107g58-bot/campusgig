package com.campusgig.service;

import com.campusgig.dto.NotificationDto;
import com.campusgig.entity.Notification;
import com.campusgig.entity.User;
import com.campusgig.exception.ForbiddenException;
import com.campusgig.exception.ResourceNotFoundException;
import com.campusgig.repository.NotificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<NotificationDto> getNotificationsForUser(User user) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(NotificationDto::fromEntity)
                .collect(Collectors.toList());
    }

    public Page<NotificationDto> getNotificationsPage(User user, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(NotificationDto::fromEntity);
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @Transactional
    public void markAsRead(Long id, User user) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + id));

        if (!n.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You are not authorized to mark this notification.");
        }

        n.setRead(true);
        notificationRepository.save(n);
    }

    @Transactional
    public void markAllAsRead(User user) {
        notificationRepository.markAllAsReadForUser(user.getId());
    }
}
