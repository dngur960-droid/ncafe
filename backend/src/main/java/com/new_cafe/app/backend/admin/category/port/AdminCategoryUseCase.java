package com.new_cafe.app.backend.admin.category.port;

import com.new_cafe.app.backend.category.domain.model.Category;
import java.util.List;

/**
 * [Inbound Port] 관리자용 카테고리 유스케이스 인터페이스
 */
public interface AdminCategoryUseCase {
    List<Category> getAllCategories();
}
