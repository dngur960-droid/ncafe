package com.new_cafe.app.backend.order.domain.model;

import java.time.LocalDateTime;

/**
 * [Domain] 주문 항목 엔티티
 */
public class OrderItem {
    private Long id;
    private Long orderId;
    private Long menuId;
    private String menuName; // 주문 당시 메뉴명
    private Integer price;   // 주문 당시 가격
    private Integer quantity;
    private String options;
    private LocalDateTime createdAt;

    public OrderItem() {}

    public OrderItem(Long id, Long orderId, Long menuId, String menuName, 
                     Integer price, Integer quantity, String options, LocalDateTime createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.menuId = menuId;
        this.menuName = menuName;
        this.price = price;
        this.quantity = quantity;
        this.options = options;
        this.createdAt = createdAt;
    }

    public static OrderItem create(Long menuId, String menuName, Integer price, Integer quantity, String options) {
        OrderItem item = new OrderItem();
        item.menuId = menuId;
        item.menuName = menuName;
        item.price = price;
        item.quantity = quantity;
        item.options = options;
        item.createdAt = LocalDateTime.now();
        return item;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public Long getMenuId() { return menuId; }
    public String getMenuName() { return menuName; }
    public Integer getPrice() { return price; }
    public Integer getQuantity() { return quantity; }
    public String getOptions() { return options; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
