package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.model.Notification;
import com.zosh.service.NotificationService;
import com.zosh.util.AdminAuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/notifications")
@RequiredArgsConstructor
public class AdminNotificationController {

    private final NotificationService notificationService;
    private final AdminAuthHelper adminAuthHelper;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(notificationService.getAdminNotifications());
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnread(
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(notificationService.getUnreadNotifications());
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }
}
