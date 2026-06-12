package com.zosh.request;

import com.zosh.domain.OrderStatus;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    private OrderStatus status;
    private String note;
}
