package com.new_cafe.app.backend.auth.adapter.in.web;

/**
 * 로그인 HTTP 요청 DTO.
 * Inbound Adapter 전용 - 도메인 패키지에 노출되지 않음.
 */
public class LoginRequest {

    private String username;
    private String password;

    public LoginRequest() {}

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() { return username; }
    public String getPassword() { return password; }

    public void setUsername(String username) { this.username = username; }
    public void setPassword(String password) { this.password = password; }
}
