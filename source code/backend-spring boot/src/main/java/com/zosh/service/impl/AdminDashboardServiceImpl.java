package com.zosh.service.impl;

import com.zosh.domain.OrderStatus;
import com.zosh.domain.PaymentStatus;
import com.zosh.domain.ProductStatus;
import com.zosh.domain.USER_ROLE;
import com.zosh.dto.*;
import com.zosh.mapper.UserMapper;
import com.zosh.model.Order;
import com.zosh.model.Product;
import com.zosh.model.User;
import com.zosh.repository.*;
import com.zosh.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public DashboardDto getDashboardData() {
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime yearStart = LocalDate.now().withDayOfYear(1).atStartOfDay();

        DashboardMetricsDto metrics = DashboardMetricsDto.builder()
                .totalRevenue(orderRepository.sumRevenueByPaymentStatus(PaymentStatus.COMPLETED))
                .todayRevenue(orderRepository.sumRevenueByPaymentStatusAndDateRange(
                        PaymentStatus.COMPLETED, todayStart, todayStart.plusDays(1)))
                .monthlyRevenue(orderRepository.sumRevenueByPaymentStatusAndDateRange(
                        PaymentStatus.COMPLETED, monthStart, monthStart.plusMonths(1)))
                .totalOrders(orderRepository.count())
                .pendingOrders(orderRepository.countByOrderStatus(OrderStatus.PENDING))
                .deliveredOrders(orderRepository.countByOrderStatus(OrderStatus.DELIVERED))
                .cancelledOrders(orderRepository.countByOrderStatus(OrderStatus.CANCELLED))
                .returnedOrders(orderRepository.countByOrderStatus(OrderStatus.RETURNED))
                .totalCustomers(userRepository.countByRole(USER_ROLE.ROLE_CUSTOMER))
                .totalProducts(productRepository.countByStatus(ProductStatus.ACTIVE))
                .totalCategories(categoryRepository.count())
                .totalReviews(reviewRepository.count())
                .build();

        List<Order> recentOrders = orderRepository.findAllByOrderByOrderDateDesc().stream().limit(10).toList();
        List<User> recentCustomers = userRepository.findByRoleOrderByCreatedAtDesc(USER_ROLE.ROLE_CUSTOMER)
                .stream().limit(10).toList();
        List<Product> lowStockProducts = productRepository
                .findByQuantityLessThanEqualAndStatus(10, ProductStatus.ACTIVE)
                .stream().limit(10).toList();

        List<ProductSalesDto> topSelling = mapTopSelling(productRepository.topSellingProducts().stream().limit(10).toList());

        return DashboardDto.builder()
                .metrics(metrics)
                .recentOrders(recentOrders.stream().map(this::toOrderSummary).toList())
                .recentCustomers(recentCustomers.stream().map(UserMapper::toUserDto).toList())
                .lowStockProducts(lowStockProducts.stream().map(this::toProductSummary).toList())
                .topSellingProducts(topSelling)
                .revenueByMonth(mapMonthlyRevenue(orderRepository.revenueByMonth(PaymentStatus.COMPLETED, yearStart)))
                .ordersByMonth(mapMonthlyOrders(orderRepository.ordersByMonth(yearStart)))
                .productSalesDistribution(mapProductDistribution(productRepository.topSellingProducts().stream().limit(5).toList()))
                .customerGrowth(mapCustomerGrowth(userRepository.customerGrowthByMonth(USER_ROLE.ROLE_CUSTOMER, yearStart)))
                .build();
    }

    private DashboardOrderSummaryDto toOrderSummary(Order order) {
        return DashboardOrderSummaryDto.builder()
                .id(order.getId())
                .orderId(order.getOrderId())
                .totalSellingPrice(order.getTotalSellingPrice())
                .orderStatus(order.getOrderStatus())
                .user(UserMapper.toUserDto(order.getUser()))
                .build();
    }

    private DashboardProductSummaryDto toProductSummary(Product product) {
        return DashboardProductSummaryDto.builder()
                .id(product.getId())
                .title(product.getTitle())
                .quantity(product.getQuantity())
                .build();
    }

    private List<ProductSalesDto> mapTopSelling(List<Object[]> rows) {
        List<ProductSalesDto> result = new ArrayList<>();
        for (Object[] row : rows) {
            Long productId = ((Number) row[0]).longValue();
            String title = (String) row[1];
            long sold = ((Number) row[2]).longValue();
            Product product = productRepository.findById(productId).orElse(null);
            String thumb = product != null ? product.getThumbnailImage() : null;
            result.add(new ProductSalesDto(productId, title, sold, thumb));
        }
        return result;
    }

    private List<ChartDataPoint> mapMonthlyRevenue(List<Object[]> rows) {
        List<ChartDataPoint> points = new ArrayList<>();
        for (Object[] row : rows) {
            int month = ((Number) row[0]).intValue();
            double revenue = ((Number) row[2]).doubleValue();
            String label = Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            points.add(new ChartDataPoint(label, revenue));
        }
        return points;
    }

    private List<ChartDataPoint> mapMonthlyOrders(List<Object[]> rows) {
        List<ChartDataPoint> points = new ArrayList<>();
        for (Object[] row : rows) {
            int month = ((Number) row[0]).intValue();
            long count = ((Number) row[2]).longValue();
            String label = Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            points.add(new ChartDataPoint(label, count));
        }
        return points;
    }

    private List<ChartDataPoint> mapProductDistribution(List<Object[]> rows) {
        List<ChartDataPoint> points = new ArrayList<>();
        for (Object[] row : rows) {
            String title = (String) row[1];
            double sold = ((Number) row[2]).doubleValue();
            points.add(new ChartDataPoint(title, sold));
        }
        return points;
    }

    private List<ChartDataPoint> mapCustomerGrowth(List<Object[]> rows) {
        List<ChartDataPoint> points = new ArrayList<>();
        for (Object[] row : rows) {
            int month = ((Number) row[0]).intValue();
            long count = ((Number) row[2]).longValue();
            String label = Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            points.add(new ChartDataPoint(label, count));
        }
        return points;
    }
}
