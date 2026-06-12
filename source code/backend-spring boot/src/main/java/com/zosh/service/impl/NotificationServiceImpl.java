package com.zosh.service.impl;

import com.zosh.domain.NotificationType;
import com.zosh.domain.USER_ROLE;
import com.zosh.model.Notification;
import com.zosh.model.User;
import com.zosh.repository.NotificationRepository;
import com.zosh.repository.UserRepository;
import com.zosh.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public Notification createNotification(User recipient, String message, NotificationType type) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setMessage(message);
        notification.setType(type);
        return notificationRepository.save(notification);
    }

    @Override
    public Notification createAdminNotification(String message, NotificationType type) {
        User admin = userRepository.findByEmail("jayantpratap1414@gmail.com");
        if (admin == null) {
            List<User> admins = userRepository.findByRoleOrderByCreatedAtDesc(USER_ROLE.ROLE_ADMIN);
            if (admins.isEmpty()) return null;
            admin = admins.get(0);
        }
        return createNotification(admin, message, type);
    }

    @Override
    public List<Notification> getAdminNotifications() {
        return notificationRepository.findTop20ByOrderBySentAtDesc();
    }

    @Override
    public List<Notification> getUnreadNotifications() {
        return notificationRepository.findByReadStatusFalseOrderBySentAtDesc();
    }

    @Override
    public long getUnreadCount() {
        return notificationRepository.countByReadStatusFalse();
    }

    @Override
    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setReadStatus(true);
        return notificationRepository.save(notification);
    }

    @Override
    public void notifyNewOrder(String orderId) {
        createAdminNotification("New order received: " + orderId, NotificationType.NEW_ORDER);
    }

    @Override
    public void notifyLowStock(String productName, int quantity) {
        createAdminNotification("Low stock alert: " + productName + " (" + quantity + " remaining)", NotificationType.LOW_STOCK);
    }

    @Override
    public void notifyOutOfStock(String productName) {
        createAdminNotification("Out of stock: " + productName, NotificationType.OUT_OF_STOCK);
    }
}
