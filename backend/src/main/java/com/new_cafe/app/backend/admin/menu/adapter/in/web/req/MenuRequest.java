package com.new_cafe.app.backend.admin.menu.adapter.in.web.req;

/**
 * 메뉴 생성/수정 HTTP 요청 바디 DTO
 */
public class MenuRequest {
    private String korName;
    private String engName;
    private String description;
    private Integer price;
    private Long categoryId;
    private Boolean isAvailable;
    private Boolean isSoldOut;
    private Integer sortOrder;

    public String getKorName() { return korName; }
    public String getEngName() { return engName; }
    public String getDescription() { return description; }
    public Integer getPrice() { return price; }
    public Long getCategoryId() { return categoryId; }
    public Boolean getIsAvailable() { return isAvailable; }
    public Boolean getIsSoldOut() { return isSoldOut; }
    public Integer getSortOrder() { return sortOrder; }
    public void setKorName(String korName) { this.korName = korName; }
    public void setEngName(String engName) { this.engName = engName; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(Integer price) { this.price = price; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    public void setIsSoldOut(Boolean isSoldOut) { this.isSoldOut = isSoldOut; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
