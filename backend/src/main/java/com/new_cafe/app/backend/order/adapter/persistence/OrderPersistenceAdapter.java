package com.new_cafe.app.backend.order.adapter.persistence;

import com.new_cafe.app.backend.order.application.port.out.OrderPort;
import com.new_cafe.app.backend.order.domain.model.Order;
import com.new_cafe.app.backend.order.domain.model.OrderItem;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * [Outbound Adapter] 주문 DB 접근 어댑터
 */
@Component
public class OrderPersistenceAdapter implements OrderPort {

    private final DataSource dataSource;

    public OrderPersistenceAdapter(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Order save(Order order) {
        if (order.getId() == null) {
            return insert(order);
        } else {
            return update(order);
        }
    }

    private Order insert(Order order) {
        String orderSql = "INSERT INTO orders (user_id, guest_name, guest_phone, total_price, status, payment_method, payment_status, memo, created_at, updated_at) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id";
        
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false); // 트랜잭션 수동 관리
            try (PreparedStatement pstmt = conn.prepareStatement(orderSql)) {
                if (order.getUserId() != null) pstmt.setLong(1, order.getUserId()); else pstmt.setNull(1, Types.BIGINT);
                pstmt.setString(2, order.getGuestName());
                pstmt.setString(3, order.getGuestPhone());
                pstmt.setInt(4, order.getTotalPrice());
                pstmt.setString(5, order.getStatus());
                pstmt.setString(6, order.getPaymentMethod());
                pstmt.setString(7, order.getPaymentStatus());
                pstmt.setString(8, order.getMemo());
                pstmt.setTimestamp(9, Timestamp.valueOf(order.getCreatedAt()));
                pstmt.setTimestamp(10, Timestamp.valueOf(order.getUpdatedAt()));

                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) order.setId(rs.getLong(1));
                }

                saveItems(conn, order.getId(), order.getItems());
                conn.commit();
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            }
        } catch (SQLException e) {
            System.err.println("OrderPersistenceAdapter.insert error: " + e.getMessage());
        }
        return order;
    }

    private Order update(Order order) {
        String sql = "UPDATE orders SET status=?, payment_status=?, updated_at=? WHERE id=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, order.getStatus());
            pstmt.setString(2, order.getPaymentStatus());
            pstmt.setTimestamp(3, Timestamp.valueOf(order.getUpdatedAt()));
            pstmt.setLong(4, order.getId());
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("OrderPersistenceAdapter.update error: " + e.getMessage());
        }
        return order;
    }

    private void saveItems(Connection conn, Long orderId, List<OrderItem> items) throws SQLException {
        String sql = "INSERT INTO order_items (order_id, menu_id, menu_name, price, quantity, options, created_at) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            for (OrderItem item : items) {
                pstmt.setLong(1, orderId);
                pstmt.setLong(2, item.getMenuId());
                pstmt.setString(3, item.getMenuName());
                pstmt.setInt(4, item.getPrice());
                pstmt.setInt(5, item.getQuantity());
                pstmt.setString(6, item.getOptions());
                pstmt.setTimestamp(7, Timestamp.valueOf(item.getCreatedAt()));
                pstmt.addBatch();
            }
            pstmt.executeBatch();
        }
    }

    @Override
    public Optional<Order> findById(Long id) {
        String sql = "SELECT * FROM orders WHERE id=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    Order order = mapRow(rs);
                    order.setItems(findItems(id));
                    return Optional.of(order);
                }
            }
        } catch (SQLException e) {
            System.err.println("OrderPersistenceAdapter.findById error: " + e.getMessage());
        }
        return Optional.empty();
    }

    @Override
    public List<Order> findAll() {
        List<Order> list = new ArrayList<>();
        String sql = "SELECT * FROM orders ORDER BY created_at DESC";
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapRow(rs));
            }
        } catch (SQLException e) {
            System.err.println("OrderPersistenceAdapter.findAll error: " + e.getMessage());
        }
        return list;
    }

    private List<OrderItem> findItems(Long orderId) {
        List<OrderItem> list = new ArrayList<>();
        String sql = "SELECT * FROM order_items WHERE order_id=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, orderId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(new OrderItem(
                            rs.getLong("id"),
                            rs.getLong("order_id"),
                            rs.getLong("menu_id"),
                            rs.getString("menu_name"),
                            rs.getInt("price"),
                            rs.getInt("quantity"),
                            rs.getString("options"),
                            rs.getTimestamp("created_at").toLocalDateTime()
                    ));
                }
            }
        } catch (SQLException e) {
            System.err.println("OrderPersistenceAdapter.findItems error: " + e.getMessage());
        }
        return list;
    }

    private Order mapRow(ResultSet rs) throws SQLException {
        return new Order(
                rs.getLong("id"),
                rs.getObject("user_id", Long.class),
                rs.getString("guest_name"),
                rs.getString("guest_phone"),
                rs.getInt("total_price"),
                rs.getString("status"),
                rs.getString("payment_method"),
                rs.getString("payment_status"),
                rs.getString("memo"),
                rs.getTimestamp("created_at").toLocalDateTime(),
                rs.getTimestamp("updated_at").toLocalDateTime()
        );
    }
}
