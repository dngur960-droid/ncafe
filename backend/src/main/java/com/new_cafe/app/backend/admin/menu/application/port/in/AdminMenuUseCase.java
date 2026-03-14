package com.new_cafe.app.backend.admin.menu.application.port.in;

import com.new_cafe.app.backend.admin.menu.adapter.in.web.req.MenuListRequest;
import com.new_cafe.app.backend.admin.menu.adapter.in.web.req.MenuRequest;
import com.new_cafe.app.backend.admin.menu.adapter.in.web.res.MenuResult;

/**
 * [Inbound Port] 관리자용 메뉴 관리 유스케이스 인터페이스
 */
public interface AdminMenuUseCase {
    MenuResult.MenuList getMenus(MenuListRequest request);
    MenuResult.MenuDetail getMenu(Long id);
    MenuResult.MenuId registerMenu(MenuRequest request);
    MenuResult.MenuId updateMenu(Long id, MenuRequest request);
    void deleteMenu(Long id);
    MenuResult.ImageList getMenuImages(Long menuId);
}
