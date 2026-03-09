package com.new_cafe.app.backend.admin.category.service;

import com.new_cafe.app.backend.admin.category.port.AdminCategoryPort;
import com.new_cafe.app.backend.admin.category.port.AdminCategoryUseCase;
import com.new_cafe.app.backend.category.domain.model.Category;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * [Application Service] 관리자용 카테고리 로직 구현
 */
@Service
public class AdminCategoryService implements AdminCategoryUseCase {

    private final AdminCategoryPort adminCategoryPort;

    public AdminCategoryService(AdminCategoryPort adminCategoryPort) {
        this.adminCategoryPort = adminCategoryPort;
    }

    @Override
    public List<Category> getAllCategories() {
        return adminCategoryPort.findAll();
    }
}
