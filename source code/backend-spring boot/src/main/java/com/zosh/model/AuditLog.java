package com.zosh.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;

    private String entityType;

    private Long entityId;

    private String performedBy;

    private String details;

    private String ipAddress;

    private LocalDateTime createdAt = LocalDateTime.now();
}
