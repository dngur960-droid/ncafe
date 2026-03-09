package com.new_cafe.app.backend.menu.domain.model;

import java.time.LocalDateTime;

/**
 * [Domain] 메뉴 이미지
 */
public class MenuImage {
    private Long id;
    private Long menuId;
    private String srcUrl;
    private LocalDateTime createdAt;
    private Integer sortOrder;

    public MenuImage() {}

    public MenuImage(Long id, Long menuId, String srcUrl, LocalDateTime createdAt, Integer sortOrder) {
        this.id = id;
        this.menuId = menuId;
        this.srcUrl = srcUrl;
        this.createdAt = createdAt;
        this.sortOrder = sortOrder;
    }

    public Long getId() { return id; }
    public Long getMenuId() { return menuId; }
    public String getSrcUrl() { return srcUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Integer getSortOrder() { return sortOrder; }
    public void setId(Long id) { this.id = id; }
    public void setMenuId(Long menuId) { this.menuId = menuId; }
    public void setSrcUrl(String srcUrl) { this.srcUrl = srcUrl; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
