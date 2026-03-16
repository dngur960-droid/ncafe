package com.new_cafe.app.backend.order.application.port.in;

import com.new_cafe.app.backend.order.application.dto.OrderRequest;
import com.new_cafe.app.backend.order.domain.model.Order;
import java.util.List;

import com.new_cafe.app.backend.order.application.dto.PaymentConfirmRequest;

/**
 * [Inbound Port] 주문 유스케이스 인터페이스
 */
public interface OrderUseCase {
    Order placeOrder(OrderRequest request, Long userId);
    Order getOrder(Long orderId);
    List<Order> getAdminOrders();
    Order updateOrderStatus(Long orderId, String status);
    Order cancelOrder(Long orderId);
    
    // Toss Payments approval
    Order confirmTossPayment(PaymentConfirmRequest request);
}
