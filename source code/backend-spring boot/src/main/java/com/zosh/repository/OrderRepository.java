package com.zosh.repository;

import com.zosh.domain.OrderStatus;
import com.zosh.domain.PaymentStatus;
import com.zosh.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    List<Order> findByOrderStatus(OrderStatus orderStatus);

    List<Order> findAllByOrderByOrderDateDesc();

    long countByOrderStatus(OrderStatus orderStatus);

    @Query("SELECT COALESCE(SUM(o.totalSellingPrice), 0) FROM Order o WHERE o.paymentStatus = :status")
    double sumRevenueByPaymentStatus(@Param("status") PaymentStatus status);

    @Query("SELECT COALESCE(SUM(o.totalSellingPrice), 0) FROM Order o WHERE o.paymentStatus = :status AND o.orderDate >= :start AND o.orderDate < :end")
    double sumRevenueByPaymentStatusAndDateRange(@Param("status") PaymentStatus status,
                                                  @Param("start") LocalDateTime start,
                                                  @Param("end") LocalDateTime end);

    @Query("SELECT MONTH(o.orderDate) as month, YEAR(o.orderDate) as year, COALESCE(SUM(o.totalSellingPrice), 0) as revenue " +
           "FROM Order o WHERE o.paymentStatus = :status AND o.orderDate >= :start " +
           "GROUP BY YEAR(o.orderDate), MONTH(o.orderDate) ORDER BY year, month")
    List<Object[]> revenueByMonth(@Param("status") PaymentStatus status, @Param("start") LocalDateTime start);

    @Query("SELECT MONTH(o.orderDate) as month, YEAR(o.orderDate) as year, COUNT(o) as count " +
           "FROM Order o WHERE o.orderDate >= :start " +
           "GROUP BY YEAR(o.orderDate), MONTH(o.orderDate) ORDER BY year, month")
    List<Object[]> ordersByMonth(@Param("start") LocalDateTime start);

    @Query("SELECT o FROM Order o WHERE " +
           "(:status IS NULL OR o.orderStatus = :status) AND " +
           "(:search IS NULL OR LOWER(o.orderId) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(o.user.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY o.orderDate DESC")
    List<Order> searchOrders(@Param("status") OrderStatus status, @Param("search") String search);
}
