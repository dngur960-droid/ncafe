package com.new_cafe.app.backend.order.application.service;

import com.new_cafe.app.backend.admin.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import com.new_cafe.app.backend.order.application.dto.OrderRequest;
import com.new_cafe.app.backend.order.application.port.in.OrderUseCase;
import com.new_cafe.app.backend.order.application.port.out.OrderPort;
import com.new_cafe.app.backend.order.domain.model.Order;
import com.new_cafe.app.backend.order.domain.model.OrderItem;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * [Application Service] 주문 비즈니스 로직 구현
 */
@Service
@Transactional
public class OrderService implements OrderUseCase {

    private final OrderPort orderPort;
    private final LoadMenuPort loadMenuPort;

    public OrderService(OrderPort orderPort, LoadMenuPort loadMenuPort) {
        this.orderPort = orderPort;
        this.loadMenuPort = loadMenuPort;
    }

    @Override
    public Order placeOrder(OrderRequest request, Long userId) {
        // 1. 주문 객체 생성
        Order order = Order.create(
                userId,
                request.getGuestName(),
                request.getGuestPhone(),
                request.getPaymentMethod(),
                request.getMemo()
        );

        // 2. 주문 항목 처리 (메뉴 정보 스냅샷 저장)
        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Menu menu = loadMenuPort.findById(itemReq.getMenuId())
                    .orElseThrow(() -> new RuntimeException("메뉴를 찾을 수 없습니다. id=" + itemReq.getMenuId()));
            
            OrderItem item = OrderItem.create(
                    menu.getId(),
                    menu.getKorName(),
                    menu.getPrice(),
                    itemReq.getQuantity(),
                    itemReq.getOptions()
            );
            order.addItem(item);
        }

        // 3. 주문 저장 (totalPrice는 addItem에서 자동 계산됨)
        return orderPort.save(order);
    }

    @Override
    public Order getOrder(Long orderId) {
        return orderPort.findById(orderId)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다. id=" + orderId));
    }

    @Override
    public List<Order> getAdminOrders() {
        return orderPort.findAll();
    }

    @Override
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = getOrder(orderId);
        order.setStatus(status);
        // 결제 완료 시 paymentStatus 업데이트 가능 (로직에 따라)
        if ("PAID".equals(status)) {
            order.setPaymentStatus("PAID");
        }
        return orderPort.save(order);
    }

    @Override
    public Order cancelOrder(Long orderId) {
        return updateOrderStatus(orderId, "CANCELLED");
    }
}
