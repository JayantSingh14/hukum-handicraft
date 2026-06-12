package com.zosh.dto;

import com.zosh.domain.OrderStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardOrderSummaryDto {
    private Long id;
    private String orderId;
    private Integer totalSellingPrice;
    private OrderStatus orderStatus;
    private UserDto user;
}
