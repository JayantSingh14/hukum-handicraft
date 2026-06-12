package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.model.Category;
import com.zosh.service.CategoryService;
import com.zosh.util.AdminAuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;
    private final AdminAuthHelper adminAuthHelper;

    @GetMapping
    public ResponseEntity<List<Category>> getAll(
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping
    public ResponseEntity<Category> create(
            @RequestBody Category category,
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return new ResponseEntity<>(categoryService.createCategory(category), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Category> update(
            @PathVariable Long id,
            @RequestBody Category category,
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        return ResponseEntity.ok(categoryService.updateCategory(id, category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws UserException {
        adminAuthHelper.requireAdmin(jwt);
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}
