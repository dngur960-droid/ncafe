package com.new_cafe.app.backend.admin.category.controller;

import com.new_cafe.app.backend.admin.category.port.AdminCategoryUseCase;
import com.new_cafe.app.backend.category.domain.model.Category;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * [Inbound Adapter] 관리자 전용 카테고리 컨트롤러
 */
@RestController
@RequestMapping("/api/admin/categories")
public class AdminCategoryController {

    private final AdminCategoryUseCase adminCategoryUseCase;

    public AdminCategoryController(AdminCategoryUseCase adminCategoryUseCase) {
        this.adminCategoryUseCase = adminCategoryUseCase;
    }

    @GetMapping
    public List<Category> getCategories() {
        return adminCategoryUseCase.getAllCategories();
    }
}
