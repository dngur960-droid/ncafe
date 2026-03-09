package com.new_cafe.app.backend.auth.application.port.in;

/**
 * 로그인 유스케이스에 전달하는 커맨드(입력) 객체.
 * 불변 객체로 설계하여 의도치 않은 상태 변경을 방지.
 */
public class LoginCommand {

    private final String username;
    private final String password;

    public LoginCommand(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() { return username; }
    public String getPassword() { return password; }
}
