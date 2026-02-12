package com.new_cafe.app.backend.controller.admin;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.new_cafe.app.backend.dto.MenuDetailResponse;
<<<<<<< HEAD
=======
import com.new_cafe.app.backend.dto.MenuImageListResponse;
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
import com.new_cafe.app.backend.dto.MenuListRequest;
import com.new_cafe.app.backend.dto.MenuListResponse;
import com.new_cafe.app.backend.entity.Menu;
<<<<<<< HEAD
import com.new_cafe.app.backend.service.MenuService;
import org.springframework.web.bind.annotation.PutMapping;
import com.new_cafe.app.backend.dto.MenuListResponse;
import com.new_cafe.app.backend.dto.MenuImageListResponse;

@RestController
@RequestMapping("/api")
=======
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.new_cafe.app.backend.service.MenuService;

@RestController
@RequestMapping("/admin/menus")
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
public class MenuController {

    private MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

<<<<<<< HEAD
    // 목록 조회 데이터 반환
    @GetMapping("/admin/menus")
=======
    @GetMapping
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
    public MenuListResponse getMenus(MenuListRequest request) {
        MenuListResponse response = menuService.getMenus(request);
        return response;
    }

<<<<<<< HEAD
    // 상세 조회 데이터 반환
    @GetMapping("/admin/menus/{id}")
    public MenuDetailResponse getMenu(@PathVariable Long id) {
        MenuDetailResponse response = menuService.getMenu(id);
        return response;
    }

    // 메뉴 이미지 목록 조회
    @GetMapping("/admin/menus/{id}/menu-images")
    public MenuImageListResponse getMenuImages(@PathVariable Long id) {
        MenuImageListResponse response = menuService.getMenuImages(id);
        return response;
=======
    // 상세 조회 데이터 반환 /admin/menus/3
    @GetMapping("/{id}")
    public MenuDetailResponse getMenu(@PathVariable Long id) {
        MenuDetailResponse response = menuService.getMenu(id);
        return response;
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
    }

    // 메뉴 생성 데이터 입력
    @PostMapping
    public String newMenu(Menu menu) {
        return "newMenu";
    }

    @PutMapping("/{id}")
    public String editMenu(Menu menu) {
        // TODO: process PUT request

        return "editMenu";
    }

    // 메뉴 삭제 데이터 입력
    @DeleteMapping("/{id}")
    public String deleteMenu() {
        return "deleteMenu";
    }

    @GetMapping("/{id}/menu-images")
    public MenuImageListResponse getMenuImages(@PathVariable Long id) {
        MenuImageListResponse response = menuService.getMenuImages(id);
        return response;
    }
}
