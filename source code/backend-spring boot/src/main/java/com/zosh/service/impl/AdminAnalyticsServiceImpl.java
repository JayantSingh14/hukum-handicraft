package com.zosh.service.impl;

import com.zosh.domain.PaymentStatus;
import com.zosh.domain.USER_ROLE;
import com.zosh.dto.AnalyticsReportDto;
import com.zosh.dto.ChartDataPoint;
import com.zosh.dto.ProductSalesDto;
import com.zosh.repository.OrderRepository;
import com.zosh.repository.ProductRepository;
import com.zosh.repository.UserRepository;
import com.zosh.service.AdminAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminAnalyticsServiceImpl implements AdminAnalyticsService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public AnalyticsReportDto getDailyReport() {
        return buildReport("Daily", LocalDate.now().atStartOfDay(), LocalDate.now().plusDays(1).atStartOfDay());
    }

    @Override
    public AnalyticsReportDto getWeeklyReport() {
        return buildReport("Weekly", LocalDate.now().minusDays(7).atStartOfDay(), LocalDate.now().plusDays(1).atStartOfDay());
    }

    @Override
    public AnalyticsReportDto getMonthlyReport() {
        return buildReport("Monthly", LocalDate.now().withDayOfMonth(1).atStartOfDay(), LocalDate.now().plusDays(1).atStartOfDay());
    }

    @Override
    public AnalyticsReportDto getYearlyReport() {
        return buildReport("Yearly", LocalDate.now().withDayOfYear(1).atStartOfDay(), LocalDate.now().plusDays(1).atStartOfDay());
    }

    private AnalyticsReportDto buildReport(String period, LocalDateTime start, LocalDateTime end) {
        double sales = orderRepository.sumRevenueByPaymentStatusAndDateRange(PaymentStatus.COMPLETED, start, end);
        long newCustomers = userRepository.countByRoleAndCreatedAtAfter(USER_ROLE.ROLE_CUSTOMER, start);

        List<ProductSalesDto> bestSelling = mapSales(productRepository.topSellingProducts().stream().limit(10).toList());
        List<ProductSalesDto> leastSelling = mapSales(productRepository.leastSellingProducts().stream().limit(10).toList());

        List<ChartDataPoint> trend = new ArrayList<>();
        trend.add(new ChartDataPoint(period, sales));

        return AnalyticsReportDto.builder()
                .period(period)
                .totalSales(sales)
                .totalOrders(orderRepository.count())
                .newCustomers(newCustomers)
                .returningCustomers(0)
                .bestSellingProducts(bestSelling)
                .leastSellingProducts(leastSelling)
                .salesTrend(trend)
                .build();
    }

    private List<ProductSalesDto> mapSales(List<Object[]> rows) {
        List<ProductSalesDto> result = new ArrayList<>();
        for (Object[] row : rows) {
            result.add(new ProductSalesDto(
                    ((Number) row[0]).longValue(),
                    (String) row[1],
                    ((Number) row[2]).longValue(),
                    null
            ));
        }
        return result;
    }
}
