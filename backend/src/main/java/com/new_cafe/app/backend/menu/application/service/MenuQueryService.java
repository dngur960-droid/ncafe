package com.new_cafe.app.backend.menu.application.service;

import com.new_cafe.app.backend.category.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.menu.application.port.out.MenuImagePort;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.category.domain.model.Category;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import com.new_cafe.app.backend.menu.domain.model.MenuImage;
import com.new_cafe.app.backend.menu.application.port.in.GetMenuQuery;
import com.new_cafe.app.backend.menu.application.port.in.MenuResult;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * [Application Service] 메뉴 조회 서비스
 */
@Service
public class MenuQueryService implements GetMenuQuery {

    private final LoadMenuPort loadMenuPort;
    private final LoadCategoryPort categoryPort;
    private final MenuImagePort menuImagePort;

    public MenuQueryService(LoadMenuPort loadMenuPort, LoadCategoryPort categoryPort, MenuImagePort menuImagePort) {
        this.loadMenuPort = loadMenuPort;
        this.categoryPort = categoryPort;
        this.menuImagePort = menuImagePort;
    }

    @Override
    public MenuResult.MenuList getMenus(Integer categoryId, String searchQuery) {
        List<Menu> menus = loadMenuPort.findAll(categoryId, searchQuery);

        List<MenuResult.MenuSummary> summaries = menus.stream()
                .map(menu -> {
                    String categoryName = categoryPort.findById(menu.getCategoryId())
                            .map(Category::getName)
                            .orElse("미지정");
                    List<MenuImage> images = menuImagePort.findAllByMenuId(menu.getId());
                    menu.setImages(images);
                    return MenuResult.MenuSummary.from(menu, categoryName);
                })
                .collect(Collectors.toList());

        return new MenuResult.MenuList(summaries, summaries.size());
    }

    @Override
    public MenuResult.MenuDetail getMenu(Long id) {
        Optional<Menu> optional = loadMenuPort.findById(id);
        if (optional.isEmpty()) return null;

        Menu menu = optional.get();
        String categoryName = categoryPort.findById(menu.getCategoryId())
                .map(Category::getName)
                .orElse("미지정");
        List<MenuImage> images = menuImagePort.findAllByMenuId(id);

        return MenuResult.MenuDetail.from(menu, categoryName, images);
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
