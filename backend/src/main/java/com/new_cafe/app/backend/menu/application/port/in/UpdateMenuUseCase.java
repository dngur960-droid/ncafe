package com.new_cafe.app.backend.menu.application.port.in;

/**
 * [Inbound Port] 메뉴 수정 커맨드
 */
public class UpdateMenuUseCase {
    private final Long id;
    private final String korName;
    private final String engName;
    private final String description;
    private final Integer price;
    private final Long categoryId;
    private final Boolean isAvailable;
    private final Boolean isSoldOut;
    private final Integer sortOrder;

    public UpdateMenuUseCase(Long id, String korName, String engName, String description,
                             Integer price, Long categoryId, Boolean isAvailable, Boolean isSoldOut, Integer sortOrder) {
        this.id = id;
        this.korName = korName;
        this.engName = engName;
        this.description = description;
        this.price = price;
        this.categoryId = categoryId;
        this.isAvailable = isAvailable;
        this.isSoldOut = isSoldOut;
        this.sortOrder = sortOrder;
    }

    public Long getId() { return id; }
    public String getKorName() { return korName; }
    public String getEngName() { return engName; }
    public String getDescription() { return description; }
    public Integer getPrice() { return price; }
    public Long getCategoryId() { return categoryId; }
    public Boolean getIsAvailable() { return isAvailable; }
    public Boolean getIsSoldOut() { return isSoldOut; }
    public Integer getSortOrder() { return sortOrder; }
}
