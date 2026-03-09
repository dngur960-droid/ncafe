package com.new_cafe.app.backend.auth.adapter.out.persistence;

import com.new_cafe.app.backend.auth.application.port.out.LoadUserPort;
import com.new_cafe.app.backend.auth.domain.model.User;

import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

/**
 * [Outbound Adapter] 유저 DB 조회 어댑터.
 *
 * LoadUserPort 인터페이스를 구현하는 실제 DB 접근 계층.
 * JDBC → JPA 또는 다른 기술로 교체 시 이 파일만 수정하면 됨.
 */
@Component
public class UserPersistenceAdapter implements LoadUserPort {

    private final DataSource dataSource;

    public UserPersistenceAdapter(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Optional<User> loadByUsername(String username) {
        String sql = "SELECT id, username, password_hash, role, created_at FROM users WHERE username = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, username);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    User user = new User(
                            rs.getLong("id"),
                            rs.getString("username"),
                            rs.getString("password_hash"),
                            rs.getString("role"),
                            rs.getTimestamp("created_at") != null
                                    ? rs.getTimestamp("created_at").toLocalDateTime()
                                    : null
                    );
                    return Optional.of(user);
                }
            }

        } catch (SQLException e) {
            System.err.println("UserPersistenceAdapter.loadByUsername Error: " + e.getMessage());
            e.printStackTrace();
        }

        return Optional.empty();
    }
}
