package com.zosh.service;

import com.zosh.domain.NotificationType;
import com.zosh.model.Notification;
import com.zosh.model.User;

import java.util.List;

public interface NotificationService {
    Notification createNotification(User recipient, String message, NotificationType type);
    Notification createAdminNotification(String message, NotificationType type);
    List<Notification> getAdminNotifications();
    List<Notification> getUnreadNotifications();
    long getUnreadCount();
    Notification markAsRead(Long id);
    void notifyNewOrder(String orderId);
    void notifyLowStock(String productName, int quantity);
    void notifyOutOfStock(String productName);
}
