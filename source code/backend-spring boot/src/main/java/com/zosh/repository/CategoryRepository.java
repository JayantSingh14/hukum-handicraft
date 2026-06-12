package com.zosh.repository;

import com.zosh.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByCategoryId(String categoryId);
    List<Category> findByLevel(Integer level);
    List<Category> findByParentCategoryId(Long parentId);
}
