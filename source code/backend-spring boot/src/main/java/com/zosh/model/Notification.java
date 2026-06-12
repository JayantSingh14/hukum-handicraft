package com.zosh.model;

import com.zosh.domain.NotificationType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private User recipient;

    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type = NotificationType.GENERAL;

    private LocalDateTime sentAt = LocalDateTime.now();

    private boolean readStatus;
}
