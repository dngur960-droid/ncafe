package com.new_cafe.app.backend.admin.menu.application.port.out;

import com.new_cafe.app.backend.admin.menu.domain.model.Menu;

public interface SaveMenuPort {
    Menu save(Menu menu);
}
