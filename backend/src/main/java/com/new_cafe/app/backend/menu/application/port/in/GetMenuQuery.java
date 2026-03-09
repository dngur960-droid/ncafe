package com.new_cafe.app.backend.menu.application.port.in;

/**
 * [Inbound Port] 메뉴 조회 Query
 */
public interface GetMenuQuery {
    MenuResult.MenuList getMenus(Integer categoryId, String searchQuery);
    MenuResult.MenuDetail getMenu(Long id);
    MenuResult.ImageList getMenuImages(Long menuId);
}
