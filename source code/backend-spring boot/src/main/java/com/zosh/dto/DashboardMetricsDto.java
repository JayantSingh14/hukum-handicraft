package com.zosh.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardMetricsDto {
    private double totalRevenue;
    private double todayRevenue;
    private double monthlyRevenue;
    private long totalOrders;
    private long pendingOrders;
    private long deliveredOrders;
    private long cancelledOrders;
    private long returnedOrders;
    private long totalCustomers;
    private long totalProducts;
    private long totalCategories;
    private long totalReviews;
}
