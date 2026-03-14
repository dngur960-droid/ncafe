package com.new_cafe.app.backend.auth.adapter.out.persistence;

import com.new_cafe.app.backend.auth.application.port.out.LoadUserPort;
import com.new_cafe.app.backend.auth.application.port.out.SaveUserPort;
import com.new_cafe.app.backend.auth.domain.model.User;

import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.*;
import java.util.Optional;

/**
 * [Outbound Adapter] 유저 DB 조회 및 저장 어댑터.
 *
 * LoadUserPort, SaveUserPort 인터페이스를 구현하는 실제 DB 접근 계층.
 */
@Component
public class UserPersistenceAdapter implements LoadUserPort, SaveUserPort {

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

    @Override
    public User save(User user) {
        String sql = "INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, ?) RETURNING id";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, user.getUsername());
            pstmt.setString(2, user.getPasswordHash());
            pstmt.setString(3, user.getRole() != null ? user.getRole() : "ROLE_USER");
            pstmt.setTimestamp(4, Timestamp.valueOf(user.getCreatedAt() != null ? user.getCreatedAt() : java.time.LocalDateTime.now()));

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    user.setId(rs.getLong("id"));
                }
            }

        } catch (SQLException e) {
            System.err.println("UserPersistenceAdapter.save Error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("회원 정보 저장 중 오류가 발생했습니다.");
        }

        return user;
    }
}
