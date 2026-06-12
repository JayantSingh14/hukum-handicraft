package com.zosh.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AnalyticsReportDto {
    private String period;
    private double totalSales;
    private long totalOrders;
    private long newCustomers;
    private long returningCustomers;
    private List<ProductSalesDto> bestSellingProducts;
    private List<ProductSalesDto> leastSellingProducts;
    private List<ChartDataPoint> salesTrend;
}
