package com.new_cafe.app.backend.order.application.port.out;

import com.new_cafe.app.backend.order.domain.model.Order;
import java.util.List;
import java.util.Optional;

/**
 * [Outbound Port] 주문 데이터 접근 인터페이스
 */
public interface OrderPort {
    Order save(Order order);
    Optional<Order> findById(Long id);
    List<Order> findAll();
}
