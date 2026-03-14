package com.new_cafe.app.backend.admin.menu.application.port.out;

import java.util.List;
import java.util.Optional;
import com.new_cafe.app.backend.admin.menu.domain.model.Menu;

public interface LoadMenuPort {
    List<Menu> findAll(Integer categoryId, String searchQuery);
    Optional<Menu> findById(Long id);
}
