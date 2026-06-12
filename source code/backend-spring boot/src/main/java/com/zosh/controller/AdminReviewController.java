package com.zosh.controller;

import com.zosh.domain.ReviewStatus;
import com.zosh.exception.UserException;
import com.zosh.model.Review;
import com.zosh.repository.ReviewRepository;
import com.zosh.util.AdminAuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {

    private final ReviewRepository reviewRepository;
    private final AdminAuthHelper adminAuthHelper;

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews(
            @RequestParam(required = false) ReviewStatus status,
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        if (status != null) {
            return ResponseEntity.ok(reviewRepository.findByStatusOrderByCreatedAtDesc(status));
        }
        return ResponseEntity.ok(reviewRepository.findAll());
    }

    @PatchMapping("/{reviewId}/approve")
    public ResponseEntity<Review> approveReview(
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setStatus(ReviewStatus.APPROVED);
        return ResponseEntity.ok(reviewRepository.save(review));
    }

    @PatchMapping("/{reviewId}/hide")
    public ResponseEntity<Review> hideReview(
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setStatus(ReviewStatus.HIDDEN);
        return ResponseEntity.ok(reviewRepository.save(review));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        reviewRepository.deleteById(reviewId);
        return ResponseEntity.ok().build();
    }
}
