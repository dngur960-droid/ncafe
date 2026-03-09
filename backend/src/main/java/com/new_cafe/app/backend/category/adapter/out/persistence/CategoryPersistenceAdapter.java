package com.new_cafe.app.backend.category.adapter.out.persistence;

import com.new_cafe.app.backend.admin.category.port.AdminCategoryPort;
import com.new_cafe.app.backend.category.application.port.out.LoadCategoryPort;
import com.new_cafe.app.backend.category.domain.model.Category;

import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * [Outbound Adapter] 카테고리 로드 어댑터
 */
@Component
public class CategoryPersistenceAdapter implements LoadCategoryPort, AdminCategoryPort {

    private final DataSource dataSource;

    public CategoryPersistenceAdapter(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<Category> findAll() {
        List<Category> list = new ArrayList<>();
        String sql = "SELECT * FROM categories";
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(new Category(rs.getLong("id"), rs.getString("name")));
            }
        } catch (SQLException e) {
            System.err.println("CategoryPersistenceAdapter.findAll error: " + e.getMessage());
        }
        return list;
    }

    @Override
    public Optional<Category> findById(Long id) {
        String sql = "SELECT * FROM categories WHERE id=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(new Category(rs.getLong("id"), rs.getString("name")));
                }
            }
        } catch (SQLException e) {
            System.err.println("CategoryPersistenceAdapter.findById error: " + e.getMessage());
        }
        return Optional.empty();
    }
}
