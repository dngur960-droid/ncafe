package com.new_cafe.app.backend.admin.menu.dto;

/**
 * 메뉴 목록 조회 HTTP 요청 파라미터
 */
public class MenuListRequest {
    private Integer categoryId;
    private String searchQuery;

    public Integer getCategoryId() { return categoryId; }
    public String getSearchQuery() { return searchQuery; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }
    public void setSearchQuery(String searchQuery) { this.searchQuery = searchQuery; }
}
