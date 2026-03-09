package com.new_cafe.app.backend.auth.adapter.in.web;

/**
 * 로그인 HTTP 응답 DTO.
 * Inbound Adapter 전용 - 도메인 패키지에 노출되지 않음.
 */
public class LoginResponse {

    private final String token;
    private final String username;
    private final String role;
    private final String message;

    public LoginResponse(String token, String username, String role, String message) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.message = message;
    }

    public String getToken() { return token; }
    public String getUsername() { return username; }
    public String getRole() { return role; }
    public String getMessage() { return message; }
}
