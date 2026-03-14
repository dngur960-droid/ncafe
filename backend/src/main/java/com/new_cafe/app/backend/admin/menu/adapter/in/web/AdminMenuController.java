package com.new_cafe.app.backend.admin.menu.adapter.in.web;

import com.new_cafe.app.backend.admin.menu.adapter.in.web.req.MenuListRequest;
import com.new_cafe.app.backend.admin.menu.adapter.in.web.req.MenuRequest;
import com.new_cafe.app.backend.admin.menu.application.port.in.AdminMenuUseCase;
import com.new_cafe.app.backend.admin.menu.adapter.in.web.res.MenuResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * [Inbound Adapter] 관리자 전용 메뉴 컨트롤러
 */
@RestController
@RequestMapping("/api/admin/menus")
public class AdminMenuController {

    private final AdminMenuUseCase adminMenuUseCase;

    public AdminMenuController(AdminMenuUseCase adminMenuUseCase) {
        this.adminMenuUseCase = adminMenuUseCase;
    }

    @GetMapping
    public ResponseEntity<MenuResult.MenuList> getMenus(MenuListRequest request) {
        return ResponseEntity.ok(adminMenuUseCase.getMenus(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuResult.MenuDetail> getMenu(@PathVariable Long id) {
        return ResponseEntity.ok(adminMenuUseCase.getMenu(id));
    }

    @PostMapping
    public ResponseEntity<MenuResult.MenuId> registerMenu(@RequestBody MenuRequest request) {
        return ResponseEntity.ok(adminMenuUseCase.registerMenu(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuResult.MenuId> updateMenu(@PathVariable Long id, @RequestBody MenuRequest request) {
        return ResponseEntity.ok(adminMenuUseCase.updateMenu(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        adminMenuUseCase.deleteMenu(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<MenuResult.ImageList> getMenuImages(@PathVariable Long id) {
        return ResponseEntity.ok(adminMenuUseCase.getMenuImages(id));
    }
}
