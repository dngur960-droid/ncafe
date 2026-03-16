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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import java.util.Base64;
import java.nio.charset.StandardCharsets;

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
    private final RestTemplate restTemplate;

    @Value("${toss.secret-key}")
    private String tossSecretKey;

    public OrderService(OrderPort orderPort, LoadMenuPort loadMenuPort) {
        this.orderPort = orderPort;
        this.loadMenuPort = loadMenuPort;
        this.restTemplate = new RestTemplate();
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

    @Override
    public Order confirmTossPayment(com.new_cafe.app.backend.order.application.dto.PaymentConfirmRequest request) {
        // 1. 주문 검증
        // Toss Payments orderId는 내부적으로 Long id를 넘겼다고 가정하고 파싱
        Long orderId = Long.parseLong(request.getOrderId().replace("ORDER-", ""));
        Order order = getOrder(orderId);
        
        // 2. 토스 승인 API 호출
        String url = "https://api.tosspayments.com/v1/payments/confirm";
        HttpHeaders headers = new HttpHeaders();
        String authHeader = "Basic " + Base64.getEncoder().encodeToString((tossSecretKey + ":").getBytes(StandardCharsets.UTF_8));
        headers.set("Authorization", authHeader);
        headers.set("Content-Type", "application/json");

        String requestBody = String.format("{\"paymentKey\":\"%s\",\"orderId\":\"%s\",\"amount\":%d}", 
            request.getPaymentKey(), request.getOrderId(), request.getAmount());

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                order.setStatus("PAID");
                order.setPaymentStatus("PAID");
                return orderPort.save(order);
            } else {
                throw new RuntimeException("결제 승인 실패: " + response.getBody());
            }
        } catch (Exception e) {
            throw new RuntimeException("결제 승인 중 오류 발생: " + e.getMessage());
        }
    }
}
