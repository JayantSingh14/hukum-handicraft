package com.zosh.request;

import com.zosh.domain.InventoryChangeType;
import lombok.Data;

@Data
public class StockAdjustmentRequest {
    private int quantity;
    private InventoryChangeType changeType;
    private String note;
}
