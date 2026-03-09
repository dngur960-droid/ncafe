package com.new_cafe.app.backend.menu.application.port.out;

import com.new_cafe.app.backend.menu.domain.model.MenuImage;

import java.util.List;

/**
 * [Outbound Port] 메뉴 이미지 저장소 접근 인터페이스
 */
public interface MenuImagePort {
    List<MenuImage> findAllByMenuId(Long menuId);
}
