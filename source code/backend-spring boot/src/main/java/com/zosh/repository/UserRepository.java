package com.zosh.repository;

import com.zosh.domain.AccountStatus;
import com.zosh.domain.USER_ROLE;
import com.zosh.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

       User findByEmail(String email);

       long countByRole(USER_ROLE role);

       List<User> findByRoleOrderByCreatedAtDesc(USER_ROLE role);

       @Query("SELECT u FROM User u WHERE u.role = :role AND " +
                     "(LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR u.mobile LIKE CONCAT('%', :search, '%'))")
       List<User> searchCustomers(@Param("role") USER_ROLE role, @Param("search") String search);

       @Query("SELECT MONTH(u.createdAt) as month, YEAR(u.createdAt) as year, COUNT(u) as count " +
                     "FROM User u WHERE u.role = :role AND u.createdAt >= :start " +
                     "GROUP BY YEAR(u.createdAt), MONTH(u.createdAt) ORDER BY year, month")
       List<Object[]> customerGrowthByMonth(@Param("role") USER_ROLE role, @Param("start") LocalDateTime start);

       long countByRoleAndCreatedAtAfter(USER_ROLE role, LocalDateTime date);
}
