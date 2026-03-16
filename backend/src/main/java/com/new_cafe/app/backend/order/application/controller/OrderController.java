package com.new_cafe.app.backend.order.application.controller;

import com.new_cafe.app.backend.auth.application.port.in.AuthResult;
import com.new_cafe.app.backend.auth.application.port.in.ParseTokenUseCase;
import com.new_cafe.app.backend.order.application.dto.OrderRequest;
import com.new_cafe.app.backend.order.application.port.in.OrderUseCase;
import com.new_cafe.app.backend.order.domain.model.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * [Inbound Adapter] 주문 컨트롤러
 */
@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderUseCase orderUseCase;
    private final ParseTokenUseCase parseTokenUseCase;

    public OrderController(OrderUseCase orderUseCase, ParseTokenUseCase parseTokenUseCase) {
        this.orderUseCase = orderUseCase;
        this.parseTokenUseCase = parseTokenUseCase;
    }

    /**
     * 주문 생성 (비회원 가능)
     */
    @PostMapping("/orders")
    public ResponseEntity<Order> placeOrder(
            @RequestBody OrderRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        Long userId = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                // 회원인 경우 유저 ID 추출 (실제 구현에서는 LoadUserPort 등을 연동하여 ID 가져오기)
                // 현재 예시에서는 간단히 이름만 authResult에서 확인 가능
                // TODO: AuthResult에 userId 필드 추가 검토
            } catch (Exception e) {
                // 토큰이 있으나 유효하지 않은 경우 비회원으로 처리하거나 에러 반환 가능
            }
        }
        
        return ResponseEntity.ok(orderUseCase.placeOrder(request, userId));
    }

    /**
     * 내 주문 조회
     */
    @GetMapping("/orders/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderUseCase.getOrder(id));
    }

    /**
     * 관리자용 전체 주문 목록
     */
    @GetMapping("/admin/orders")
    public ResponseEntity<List<Order>> getAdminOrders() {
        return ResponseEntity.ok(orderUseCase.getAdminOrders());
    }

    /**
     * 관리자용 주문 상태 변경
     */
    @PutMapping("/admin/orders/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(orderUseCase.updateOrderStatus(id, status));
    }

    /**
     * 토스페이먼츠 결제 승인 확인
     */
    @PostMapping("/orders/confirm")
    public ResponseEntity<Order> confirmPayment(@RequestBody com.new_cafe.app.backend.order.application.dto.PaymentConfirmRequest request) {
        return ResponseEntity.ok(orderUseCase.confirmTossPayment(request));
    }
}
