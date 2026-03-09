package com.new_cafe.app.backend.config;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * 초기 데이터 생성 설정
 */
@Component
public class DataInitializerConfig implements CommandLineRunner {

    private final DataSource dataSource;

    public DataInitializerConfig(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {
        initializeAdminUser();
        initializeCategories();
    }

    private void initializeAdminUser() {
        String checkSql = "SELECT count(*) FROM users WHERE username = 'admin'";
        String insertSql = "INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)";

        try (Connection conn = dataSource.getConnection()) {
            try (PreparedStatement checkStmt = conn.prepareStatement(checkSql);
                 ResultSet rs = checkStmt.executeQuery()) {
                if (rs.next() && rs.getInt(1) > 0) {
                    System.out.println("✅ 관리자 계정 (admin) 이 이미 존재합니다.");
                    return;
                }
            }

            System.out.println("⏳ 관리자 계정 (admin) 생성 중...");
            try (PreparedStatement insertStmt = conn.prepareStatement(insertSql)) {
                String hashedPassword = BCrypt.hashpw("1234", BCrypt.gensalt());
                insertStmt.setString(1, "admin");
                insertStmt.setString(2, hashedPassword);
                insertStmt.setString(3, "ROLE_ADMIN");
                insertStmt.executeUpdate();
                System.out.println("🎉 관리자 계정 생성 완료! (ID: admin / PW: 1234)");
            }
        } catch (Exception e) {
            System.err.println("⚠ 관리자 계정 생성 중 오류 발생: " + e.getMessage());
        }
    }

    private void initializeCategories() {
        String[] categories = {"커피", "음료", "티", "디저트", "베이커리"};
        String checkSql = "SELECT count(*) FROM categories";
        String insertSql = "INSERT INTO categories (name) VALUES (?)";

        try (Connection conn = dataSource.getConnection()) {
            try (PreparedStatement checkStmt = conn.prepareStatement(checkSql);
                 ResultSet rs = checkStmt.executeQuery()) {
                if (rs.next() && rs.getInt(1) > 0) {
                    return; // 이미 데이터가 있음
                }
            }

            System.out.println("⏳ 기본 카테고리 생성 중...");
            try (PreparedStatement insertStmt = conn.prepareStatement(insertSql)) {
                for (String category : categories) {
                    insertStmt.setString(1, category);
                    insertStmt.executeUpdate();
                }
                System.out.println("🎉 기본 카테고리 생성 완료!");
            }
        } catch (Exception e) {
            System.err.println("⚠ 카테고리 초기화 중 오류 발생: " + e.getMessage());
        }
    }
}
