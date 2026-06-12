package com.zosh.service;

import com.zosh.model.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    List<Category> getTopLevelCategories();
    List<Category> getSubcategories(Long parentId);
    Category createCategory(Category category);
    Category updateCategory(Long id, Category category);
    void deleteCategory(Long id);
}
