package com.zosh.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardDto {
    private DashboardMetricsDto metrics;
    private List<DashboardOrderSummaryDto> recentOrders;
    private List<UserDto> recentCustomers;
    private List<DashboardProductSummaryDto> lowStockProducts;
    private List<ProductSalesDto> topSellingProducts;
    private List<ChartDataPoint> revenueByMonth;
    private List<ChartDataPoint> ordersByMonth;
    private List<ChartDataPoint> productSalesDistribution;
    private List<ChartDataPoint> customerGrowth;
}
