package com.new_cafe.app.backend.order.domain.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * [Domain] 주문 엔티티
 */
public class Order {
    private Long id;
    private Long userId; // 회원 ID (null이면 비회원)
    private String guestName;
    private String guestPhone;
    private Integer totalPrice;
    private String status; // PENDING, PAID, PREPARING, READY, COMPLETED, CANCELLED
    private String paymentMethod;
    private String paymentStatus;
    private String memo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<OrderItem> items = new ArrayList<>();

    public Order() {}

    public Order(Long id, Long userId, String guestName, String guestPhone, Integer totalPrice, 
                 String status, String paymentMethod, String paymentStatus, String memo, 
                 LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.guestName = guestName;
        this.guestPhone = guestPhone;
        this.totalPrice = totalPrice;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.memo = memo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Order create(Long userId, String guestName, String guestPhone, 
                               String paymentMethod, String memo) {
        Order order = new Order();
        order.userId = userId;
        order.guestName = guestName;
        order.guestPhone = guestPhone;
        order.status = "PENDING";
        order.paymentMethod = paymentMethod;
        order.paymentStatus = "UNPAID";
        order.memo = memo;
        order.createdAt = LocalDateTime.now();
        order.updatedAt = LocalDateTime.now();
        order.totalPrice = 0;
        return order;
    }

    public void addItem(OrderItem item) {
        this.items.add(item);
        this.totalPrice += item.getPrice() * item.getQuantity();
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public String getGuestName() { return guestName; }
    public String getGuestPhone() { return guestPhone; }
    public Integer getTotalPrice() { return totalPrice; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public String getMemo() { return memo; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}
