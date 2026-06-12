package com.zosh.repository;

import com.zosh.model.InventoryLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryLogRepository extends JpaRepository<InventoryLog, Long> {
    List<InventoryLog> findByProductIdOrderByChangedAtDesc(Long productId);
}
