package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import com.new_cafe.app.backend.category.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.category.domain.model.Category;
import org.springframework.stereotype.Component;

/**
 * [Outbound Adapter] 메뉴 관리에 필요한 카테고리 정보 연동 어댑터
 */
@Component
public class MenuCategoryAdapter {

    private final LoadCategoryPort loadCategoryPort;

    public MenuCategoryAdapter(LoadCategoryPort loadCategoryPort) {
        this.loadCategoryPort = loadCategoryPort;
    }

    public String getCategoryName(Long categoryId) {
        if (categoryId == null) return "미지정";
        return loadCategoryPort.findById(categoryId)
                .map(Category::getName)
                .orElse("미지정");
    }
}
