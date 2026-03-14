package com.new_cafe.app.backend.menu.adapter.in.web;

import com.new_cafe.app.backend.menu.application.port.in.GetMenuQuery;
import com.new_cafe.app.backend.admin.menu.adapter.in.web.res.MenuResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * [Inbound Adapter] 일반 고객용 메뉴 공개 컨트롤러
 */
@RestController
@RequestMapping("/api/menus")
public class MenuController {

    private final GetMenuQuery getMenuQuery;

    public MenuController(GetMenuQuery getMenuQuery) {
        this.getMenuQuery = getMenuQuery;
    }

    @GetMapping
    public ResponseEntity<MenuResult.MenuList> getMenus(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String searchQuery) {
        return ResponseEntity.ok(getMenuQuery.getMenus(categoryId, searchQuery));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuResult.MenuDetail> getMenu(@PathVariable Long id) {
        MenuResult.MenuDetail detail = getMenuQuery.getMenu(id);
        if (detail == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(detail);
    }
}
