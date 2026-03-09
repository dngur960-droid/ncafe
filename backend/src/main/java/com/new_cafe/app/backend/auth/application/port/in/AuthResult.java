package com.new_cafe.app.backend.auth.application.port.in;

/**
 * 로그인 성공 시 반환하는 결과 객체.
 * 토큰 방식, 세션 방식 등 인증 방식이 바뀌어도 이 인터페이스는 유지됨.
 */
public class AuthResult {

    private final String token;
    private final String username;
    private final String role;

    public AuthResult(String token, String username, String role) {
        this.token = token;
        this.username = username;
        this.role = role;
    }

    public String getToken() { return token; }
    public String getUsername() { return username; }
    public String getRole() { return role; }
}
