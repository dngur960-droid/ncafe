package com.new_cafe.app.backend.menu.adapter.in.web;

import com.new_cafe.app.backend.admin.category.port.AdminCategoryUseCase;
import com.new_cafe.app.backend.category.domain.model.Category;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * [Inbound Adapter] 일반 고객용 카테고리 컨트롤러
 */
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final AdminCategoryUseCase adminCategoryUseCase;

    public CategoryController(AdminCategoryUseCase adminCategoryUseCase) {
        this.adminCategoryUseCase = adminCategoryUseCase;
    }

    @GetMapping
    public List<Category> getCategories() {
        return adminCategoryUseCase.getAllCategories();
    }
}
