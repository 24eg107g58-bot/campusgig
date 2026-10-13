package com.campusgig.service;

import com.campusgig.dto.ConversationDto;
import com.campusgig.dto.MessageDto;
import com.campusgig.entity.Conversation;
import com.campusgig.entity.Message;
import com.campusgig.entity.Notification;
import com.campusgig.entity.User;
import com.campusgig.enums.NotificationType;
import com.campusgig.exception.BadRequestException;
import com.campusgig.exception.ResourceNotFoundException;
import com.campusgig.repository.ConversationRepository;
import com.campusgig.repository.MessageRepository;
import com.campusgig.repository.NotificationRepository;
import com.campusgig.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public MessageService(ConversationRepository conversationRepository,
                          MessageRepository messageRepository,
                          UserRepository userRepository,
                          NotificationRepository notificationRepository,
                          SimpMessagingTemplate messagingTemplate) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public List<ConversationDto> getConversationsForUser(User user) {
        List<Conversation> convs = conversationRepository.findForUser(user.getId());
        return convs.stream().map(c -> {
            List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(c.getId());
            String lastMsgText = messages.isEmpty() ? "" : messages.get(messages.size() - 1).getContent();
            long unread = messageRepository.countUnreadInConversation(c.getId(), user.getId());
            return ConversationDto.fromEntity(c, user.getId(), lastMsgText, unread);
        }).collect(Collectors.toList());
    }

    @Transactional
    public List<MessageDto> getMessages(User user, Long otherUserId) {
        Conversation conv = getOrCreateConversation(user.getId(), otherUserId);
        messageRepository.markAllAsReadInConversation(conv.getId(), user.getId());
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conv.getId()).stream()
                .map(MessageDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageDto sendMessage(User sender, Long receiverId, String content) {
        if (sender.getId().equals(receiverId)) {
            throw new BadRequestException("You cannot send a message to yourself.");
        }

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found with ID: " + receiverId));

        Conversation conversation = getOrCreateConversation(sender.getId(), receiverId);
        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content.trim());
        message.setRead(false);

        Message saved = messageRepository.save(message);
        MessageDto dto = MessageDto.fromEntity(saved);

        // Real-time WebSocket STOMP notification
        try {
            messagingTemplate.convertAndSend("/topic/messages." + receiverId, dto);
            messagingTemplate.convertAndSend("/topic/messages." + sender.getId(), dto);
        } catch (Exception e) {
            // Log and allow graceful REST fallback
        }

        // Persistent notification
        Notification notif = new Notification(
                receiver,
                "New message from " + sender.getFullName(),
                content.length() > 60 ? content.substring(0, 57) + "..." : content,
                NotificationType.MESSAGE,
                sender.getId()
        );
        notificationRepository.save(notif);

        return dto;
    }

    public long getUnreadMessageCount(Long userId) {
        return messageRepository.countUnreadForUser(userId);
    }

    @Transactional
    public Conversation getOrCreateConversation(Long u1, Long u2) {
        return conversationRepository.findBetweenUsers(u1, u2).orElseGet(() -> {
            User userOne = userRepository.findById(u1)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + u1));
            User userTwo = userRepository.findById(u2)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + u2));
            Conversation newConv = new Conversation(userOne, userTwo);
            return conversationRepository.save(newConv);
        });
    }
}
