package com.new_cafe.app.backend.menu.domain.model;

import com.new_cafe.app.backend.category.domain.model.Category;
import java.time.LocalDateTime;
import java.util.List;

/**
 * [Domain] 메뉴 - 외부 프레임워크 의존 없음
 */
public class Menu {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private Integer price;
    private Long categoryId;
    private Boolean isAvailable;
    private Boolean isSoldOut;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 연관 도메인 (조회 시 채워짐)
    private Category category;
    private List<MenuImage> images;

    public Menu() {}

    public Menu(Long id, String korName, String engName, String description,
                Integer price, Long categoryId, Boolean isAvailable, Boolean isSoldOut, Integer sortOrder,
                LocalDateTime createdAt, LocalDateTime updatedAt,
                Category category, List<MenuImage> images) {
        this.id = id;
        this.korName = korName;
        this.engName = engName;
        this.description = description;
        this.price = price;
        this.categoryId = categoryId;
        this.isAvailable = isAvailable;
        this.isSoldOut = isSoldOut;
        this.sortOrder = sortOrder;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.category = category;
        this.images = images;
    }

    // ── 정적 팩토리 메서드 ──

    public static Menu create(String korName, String engName, String description,
                              Integer price, Long categoryId,
                              Boolean isAvailable, Boolean isSoldOut, Integer sortOrder) {
        Menu menu = new Menu();
        menu.korName = korName;
        menu.engName = engName;
        menu.description = description;
        menu.price = price;
        menu.categoryId = categoryId;
        menu.isAvailable = isAvailable != null ? isAvailable : true;
        menu.isSoldOut = isSoldOut != null ? isSoldOut : false;
        menu.sortOrder = sortOrder != null ? sortOrder : 1;
        menu.createdAt = LocalDateTime.now();
        menu.updatedAt = LocalDateTime.now();
        return menu;
    }

    public void update(String korName, String engName, String description,
                       Integer price, Long categoryId, Boolean isAvailable, Boolean isSoldOut, Integer sortOrder) {
        if (korName != null) this.korName = korName;
        if (engName != null) this.engName = engName;
        if (description != null) this.description = description;
        if (price != null) this.price = price;
        if (categoryId != null) this.categoryId = categoryId;
        if (isAvailable != null) this.isAvailable = isAvailable;
        if (isSoldOut != null) this.isSoldOut = isSoldOut;
        if (sortOrder != null) this.sortOrder = sortOrder;
        this.updatedAt = LocalDateTime.now();
    }

    public String thumbnailSrc() {
        if (images == null || images.isEmpty()) return "blank.png";
        return images.get(0).getSrcUrl();
    }

    // ── Getters & Setters ──

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getKorName() { return korName; }
    public void setKorName(String korName) { this.korName = korName; }
    public String getEngName() { return engName; }
    public void setEngName(String engName) { this.engName = engName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getPrice() { return price; }
    public void setPrice(Integer price) { this.price = price; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    public Boolean getIsSoldOut() { return isSoldOut; }
    public void setIsSoldOut(Boolean isSoldOut) { this.isSoldOut = isSoldOut; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public List<MenuImage> getImages() { return images; }
    public void setImages(List<MenuImage> images) { this.images = images; }
}
