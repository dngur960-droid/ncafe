package com.new_cafe.app.backend.order.application.dto;

import java.util.List;

/**
 * 주문 생성 요청 DTO
 */
public class OrderRequest {
    private String guestName;
    private String guestPhone;
    private String paymentMethod;
    private String memo;
    private List<OrderItemRequest> items;

    public static class OrderItemRequest {
        private Long menuId;
        private Integer quantity;
        private String options;

        public Long getMenuId() { return menuId; }
        public void setMenuId(Long menuId) { this.menuId = menuId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public String getOptions() { return options; }
        public void setOptions(String options) { this.options = options; }
    }

    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }
    public String getGuestPhone() { return guestPhone; }
    public void setGuestPhone(String guestPhone) { this.guestPhone = guestPhone; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getMemo() { return memo; }
    public void setMemo(String memo) { this.memo = memo; }
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
}
