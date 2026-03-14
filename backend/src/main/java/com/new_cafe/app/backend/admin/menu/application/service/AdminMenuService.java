package com.new_cafe.app.backend.admin.menu.application.service;

import com.new_cafe.app.backend.admin.menu.adapter.in.web.req.MenuListRequest;
import com.new_cafe.app.backend.admin.menu.adapter.in.web.req.MenuRequest;
import com.new_cafe.app.backend.admin.menu.application.port.in.AdminMenuUseCase;
import com.new_cafe.app.backend.admin.menu.adapter.out.persistence.MenuCategoryAdapter;
import com.new_cafe.app.backend.admin.menu.adapter.in.web.res.MenuResult;
import com.new_cafe.app.backend.admin.menu.application.port.out.DeleteMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.MenuImagePort;
import com.new_cafe.app.backend.admin.menu.application.port.out.SaveMenuPort;
import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import com.new_cafe.app.backend.admin.menu.domain.model.MenuImage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * [Application Service] 관리자 영역 메뉴 비즈니스 로직 처리
 */
@Service
@Transactional
public class AdminMenuService implements AdminMenuUseCase {

    private final LoadMenuPort loadMenuPort;
    private final SaveMenuPort saveMenuPort;
    private final DeleteMenuPort deleteMenuPort;
    private final MenuCategoryAdapter menuCategoryAdapter;
    private final MenuImagePort menuImagePort;

    public AdminMenuService(LoadMenuPort loadMenuPort, SaveMenuPort saveMenuPort, 
                            DeleteMenuPort deleteMenuPort, MenuCategoryAdapter menuCategoryAdapter,
                            MenuImagePort menuImagePort) {
        this.loadMenuPort = loadMenuPort;
        this.saveMenuPort = saveMenuPort;
        this.deleteMenuPort = deleteMenuPort;
        this.menuCategoryAdapter = menuCategoryAdapter;
        this.menuImagePort = menuImagePort;
    }

    @Override
    public MenuResult.MenuList getMenus(MenuListRequest request) {
        List<Menu> menus = loadMenuPort.findAll(request.getCategoryId(), request.getSearchQuery());

        List<MenuResult.MenuSummary> summaries = menus.stream()
                .map(menu -> {
                    String categoryName = menuCategoryAdapter.getCategoryName(menu.getCategoryId());
                    List<MenuImage> images = menuImagePort.findAllByMenuId(menu.getId());
                    menu.setImages(images);
                    return MenuResult.MenuSummary.from(menu, categoryName);
                })
                .collect(Collectors.toList());

        return new MenuResult.MenuList(summaries, summaries.size());
    }

    @Override
    public MenuResult.MenuDetail getMenu(Long id) {
        Menu menu = loadMenuPort.findById(id)
                .orElseThrow(() -> new RuntimeException("메뉴를 찾을 수 없습니다. id=" + id));

        String categoryName = menuCategoryAdapter.getCategoryName(menu.getCategoryId());
        List<MenuImage> images = menuImagePort.findAllByMenuId(id);

        return MenuResult.MenuDetail.from(menu, categoryName, images);
    }

    @Override
    public MenuResult.MenuId registerMenu(MenuRequest request) {
        Menu menu = Menu.create(
                request.getKorName(), request.getEngName(), request.getDescription(),
                request.getPrice(), request.getCategoryId(),
                request.getIsAvailable(), request.getIsSoldOut(), request.getSortOrder()
        );
        Menu saved = saveMenuPort.save(menu);
        return new MenuResult.MenuId(saved.getId());
    }

    @Override
    public MenuResult.MenuId updateMenu(Long id, MenuRequest request) {
        Menu menu = loadMenuPort.findById(id)
                .orElseThrow(() -> new RuntimeException("메뉴를 찾을 수 없습니다. id=" + id));

        menu.update(
                request.getKorName(), request.getEngName(), request.getDescription(),
                request.getPrice(), request.getCategoryId(),
                request.getIsAvailable(), request.getIsSoldOut(), request.getSortOrder()
        );
        Menu saved = saveMenuPort.save(menu);
        return new MenuResult.MenuId(saved.getId());
    }

    @Override
    public void deleteMenu(Long id) {
        deleteMenuPort.deleteById(id);
    }

    @Override
    public MenuResult.ImageList getMenuImages(Long menuId) {
        Optional<Menu> menu = loadMenuPort.findById(menuId);
        String menuName = menu.map(Menu::getKorName).orElse("메뉴");

        List<MenuImage> images = menuImagePort.findAllByMenuId(menuId);
        List<MenuResult.ImageInfo> imageInfos = images.stream()
                .map(img -> MenuResult.ImageInfo.from(img, menuName))
                .collect(Collectors.toList());

        return new MenuResult.ImageList(imageInfos);
    }
}
