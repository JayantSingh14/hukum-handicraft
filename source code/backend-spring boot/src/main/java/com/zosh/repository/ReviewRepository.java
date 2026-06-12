package com.zosh.repository;

import com.zosh.domain.ReviewStatus;
import com.zosh.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductId(Long productId);
    List<Review> findByProductIdAndStatus(Long productId, ReviewStatus status);
    List<Review> findByStatusOrderByCreatedAtDesc(ReviewStatus status);
    long countByStatus(ReviewStatus status);
}
