package com.new_cafe.app.backend.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

<<<<<<< HEAD
=======
import org.springframework.beans.factory.annotation.Autowired;
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
import org.springframework.stereotype.Repository;

import com.new_cafe.app.backend.entity.MenuImage;

@Repository
public class NewMenuImageRepository implements MenuImageRepository {

<<<<<<< HEAD
    private final DataSource dataSource;

    public NewMenuImageRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }
=======
    @Autowired
    private DataSource dataSource;
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e

    @Override
    public List<MenuImage> findAllByMenuId(Long menuId) {
        List<MenuImage> list = new ArrayList<>();
        String sql = "SELECT * FROM menu_images WHERE menu_id = ? ORDER BY sort_order";

        try (Connection conn = dataSource.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setLong(1, menuId);
<<<<<<< HEAD
=======

>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(MenuImage.builder()
                            .id(rs.getLong("id"))
                            .menuId(rs.getLong("menu_id"))
<<<<<<< HEAD
                            .url(rs.getString("src_url"))
=======
                            .srcUrl(rs.getString("src_url"))
                            .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
                            .sortOrder(rs.getInt("sort_order"))
                            .build());
                }
            }
        } catch (SQLException e) {
<<<<<<< HEAD
            System.err.println("NewMenuImageRepository.findAllByMenuId Error: " + e.getMessage());
        }
        return list;
    }

    @Override
    public MenuImage save(MenuImage menuImage) {
        String sql = "INSERT INTO menu_images (menu_id, src_url, sort_order) VALUES (?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setLong(1, menuImage.getMenuId());
            pstmt.setString(2, menuImage.getUrl());
            pstmt.setInt(3, menuImage.getSortOrder());
            pstmt.executeUpdate();

        } catch (SQLException e) {
            System.err.println("NewMenuImageRepository.save Error: " + e.getMessage());
        }
        return menuImage;
    }

    @Override
    public void deleteById(Long id) {
        String sql = "DELETE FROM menu_images WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setLong(1, id);
            pstmt.executeUpdate();

        } catch (SQLException e) {
            System.err.println("NewMenuImageRepository.deleteById Error: " + e.getMessage());
        }
    }
=======
            e.printStackTrace();
        }

        return list;
    }
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
}
