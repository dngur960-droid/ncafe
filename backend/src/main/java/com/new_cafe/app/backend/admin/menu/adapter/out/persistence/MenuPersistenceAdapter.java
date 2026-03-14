package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import com.new_cafe.app.backend.admin.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.SaveMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.DeleteMenuPort;
import com.new_cafe.app.backend.admin.menu.domain.model.Menu;
import jakarta.annotation.PostConstruct;

import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * [Outbound Adapter] 메뉴 DB 접근 어댑터
 */
@Component
public class MenuPersistenceAdapter implements LoadMenuPort, SaveMenuPort, DeleteMenuPort {

    private final DataSource dataSource;

    public MenuPersistenceAdapter(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @PostConstruct
    public void init() {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.execute("ALTER TABLE menus ADD COLUMN IF NOT EXISTS is_sold_out BOOLEAN DEFAULT FALSE");
        } catch (SQLException e) {
            System.err.println("MenuPersistenceAdapter.init error: " + e.getMessage());
        }
    }

    @Override
    public List<Menu> findAll(Integer categoryId, String searchQuery) {
        List<Menu> list = new ArrayList<>();
        String sql = "SELECT * FROM menus WHERE 1=1";
        if (categoryId != null) sql += " AND category_id=" + categoryId;
        if (searchQuery != null && !searchQuery.isEmpty())
            sql += " AND kor_name LIKE '%" + searchQuery + "%'";

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapRow(rs));
            }
        } catch (SQLException e) {
            System.err.println("MenuPersistenceAdapter.findAll error: " + e.getMessage());
        }
        return list;
    }

    @Override
    public Optional<Menu> findById(Long id) {
        String sql = "SELECT * FROM menus WHERE id=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) return Optional.of(mapRow(rs));
            }
        } catch (SQLException e) {
            System.err.println("MenuPersistenceAdapter.findById error: " + e.getMessage());
        }
        return Optional.empty();
    }

    @Override
    public Menu save(Menu menu) {
        String sql;
        if (menu.getId() == null) {
            sql = "INSERT INTO menus (kor_name, eng_name, price, description, category_id, is_available, is_sold_out, sort_order, created_at, updated_at) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id";
        } else {
            sql = "UPDATE menus SET kor_name=?, eng_name=?, price=?, description=?, category_id=?, is_available=?, is_sold_out=?, sort_order=?, updated_at=? "
                + "WHERE id=? RETURNING id";
        }

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, menu.getKorName());
            pstmt.setString(2, menu.getEngName());
            if (menu.getPrice() != null) pstmt.setInt(3, menu.getPrice()); else pstmt.setNull(3, Types.INTEGER);
            pstmt.setString(4, menu.getDescription());
            if (menu.getCategoryId() != null) pstmt.setLong(5, menu.getCategoryId()); else pstmt.setNull(5, Types.BIGINT);
            pstmt.setBoolean(6, menu.getIsAvailable() != null ? menu.getIsAvailable() : true);
            pstmt.setBoolean(7, menu.getIsSoldOut() != null ? menu.getIsSoldOut() : false);
            pstmt.setInt(8, menu.getSortOrder() != null ? menu.getSortOrder() : 1);

            if (menu.getId() == null) {
                pstmt.setTimestamp(9, Timestamp.valueOf(menu.getCreatedAt()));
                pstmt.setTimestamp(10, Timestamp.valueOf(menu.getUpdatedAt()));
            } else {
                pstmt.setTimestamp(9, Timestamp.valueOf(menu.getUpdatedAt()));
                pstmt.setLong(10, menu.getId());
            }

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) menu.setId(rs.getLong("id"));
            }
        } catch (SQLException e) {
            System.err.println("MenuPersistenceAdapter.save error: " + e.getMessage());
        }
        return menu;
    }

    @Override
    public void deleteById(Long id) {
        String sql = "DELETE FROM menus WHERE id=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("MenuPersistenceAdapter.deleteById error: " + e.getMessage());
        }
    }

    private Menu mapRow(ResultSet rs) throws SQLException {
        return new Menu(
                rs.getLong("id"),
                rs.getString("kor_name"),
                rs.getString("eng_name"),
                rs.getString("description"),
                rs.getInt("price"),
                rs.getLong("category_id"),
                rs.getBoolean("is_available"),
                rs.getBoolean("is_sold_out"),
                rs.getInt("sort_order"),
                rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null,
                rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null,
                null, null
        );
    }
}
