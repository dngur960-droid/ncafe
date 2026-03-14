package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import com.new_cafe.app.backend.admin.menu.application.port.out.MenuImagePort;
import com.new_cafe.app.backend.admin.menu.domain.model.MenuImage;

import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * [Outbound Adapter] 메뉴 이미지 DB 접근 어댑터
 */
@Component
public class MenuImagePersistenceAdapter implements MenuImagePort {

    private final DataSource dataSource;

    public MenuImagePersistenceAdapter(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<MenuImage> findAllByMenuId(Long menuId) {
        List<MenuImage> list = new ArrayList<>();
        String sql = "SELECT * FROM menu_images WHERE menu_id=? ORDER BY sort_order";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, menuId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(new MenuImage(
                            rs.getLong("id"),
                            rs.getLong("menu_id"),
                            rs.getString("src_url"),
                            rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null,
                            rs.getInt("sort_order")
                    ));
                }
            }
        } catch (SQLException e) {
            System.err.println("MenuImagePersistenceAdapter.findAllByMenuId error: " + e.getMessage());
        }
        return list;
    }
}
