package com.new_cafe.app.backend.auth.domain.model;

import java.time.LocalDateTime;

/**
 * 인증 도메인 핵심 객체.
 * 외부 기술(DB, HTTP)에 의존하지 않는 순수 도메인 모델.
 */
public class User {

    private final Long id;
    private final String username;
    private final String passwordHash;
    private final String role;
    private final LocalDateTime createdAt;

    public User(Long id, String username, String passwordHash, String role, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getPasswordHash() { return passwordHash; }
    public String getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    /**
     * 비밀번호 검증 로직.
     * BCrypt.checkpw를 활용하여 검증합니다.
     */
    public boolean matchesPassword(String rawPassword) {
        return org.mindrot.jbcrypt.BCrypt.checkpw(rawPassword, this.passwordHash);
    }
}
