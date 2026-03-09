package com.new_cafe.app.backend.admin.category.port;

import com.new_cafe.app.backend.category.domain.model.Category;
import java.util.List;
import java.util.Optional;

/**
 * [Outbound Port] 관리자용 카테고리 데이터 접근 인터페이스
 */
public interface AdminCategoryPort {
    List<Category> findAll();
    Optional<Category> findById(Long id);
}
