package com.zosh.model;

import com.zosh.domain.InventoryChangeType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private int previousQuantity;

    private int newQuantity;

    private int changeAmount;

    @Enumerated(EnumType.STRING)
    private InventoryChangeType changeType;

    private String note;

    private String changedBy;

    private LocalDateTime changedAt = LocalDateTime.now();
}
