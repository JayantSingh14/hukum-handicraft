package com.zosh.service.impl;

import com.zosh.model.Category;
import com.zosh.repository.CategoryRepository;
import com.zosh.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public List<Category> getTopLevelCategories() {
        return categoryRepository.findByLevel(1);
    }

    @Override
    public List<Category> getSubcategories(Long parentId) {
        return categoryRepository.findByParentCategoryId(parentId);
    }

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long id, Category category) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        existing.setName(category.getName());
        existing.setCategoryId(category.getCategoryId());
        existing.setLevel(category.getLevel());
        existing.setParentCategory(category.getParentCategory());
        return categoryRepository.save(existing);
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
