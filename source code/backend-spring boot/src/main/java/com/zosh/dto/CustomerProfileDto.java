package com.zosh.dto;

import com.zosh.domain.AccountStatus;
import com.zosh.model.Order;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CustomerProfileDto {
    private Long id;
    private String fullName;
    private String email;
    private String mobile;
    private LocalDateTime registrationDate;
    private AccountStatus accountStatus;
    private long totalOrders;
    private double totalSpend;
    private List<Order> orderHistory;
}
