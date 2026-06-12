package com.zosh.repository;

import com.zosh.domain.ProductStatus;
import com.zosh.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    List<Product> findTop10ByOrderByCreatedAtDesc();

    @Query("SELECT p FROM Product p WHERE p.title LIKE %:query% OR p.description LIKE %:query%")
    List<Product> searchProduct(@Param("query") String query);

    List<Product> findByQuantityLessThanEqualAndStatus(int threshold, ProductStatus status);

    List<Product> findByQuantityEqualsAndStatus(int quantity, ProductStatus status);

    List<Product> findByFeaturedTrueAndStatus(ProductStatus status);

    long countByStatus(ProductStatus status);

    @Query("SELECT oi.product.id, oi.product.title, SUM(oi.quantity) as totalSold " +
           "FROM OrderItem oi JOIN oi.order o WHERE o.paymentStatus = 'COMPLETED' " +
           "GROUP BY oi.product.id, oi.product.title ORDER BY totalSold DESC")
    List<Object[]> topSellingProducts();

    @Query("SELECT oi.product.id, oi.product.title, SUM(oi.quantity) as totalSold " +
           "FROM OrderItem oi JOIN oi.order o WHERE o.paymentStatus = 'COMPLETED' " +
           "GROUP BY oi.product.id, oi.product.title ORDER BY totalSold ASC")
    List<Object[]> leastSellingProducts();
}
