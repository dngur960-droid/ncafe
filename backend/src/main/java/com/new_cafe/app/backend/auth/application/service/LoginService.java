package com.new_cafe.app.backend.auth.application.service;

import com.new_cafe.app.backend.auth.application.port.in.AuthResult;
import com.new_cafe.app.backend.auth.application.port.in.LoginCommand;
import com.new_cafe.app.backend.auth.application.port.in.LoginUseCase;
import com.new_cafe.app.backend.auth.application.port.out.GenerateTokenPort;
import com.new_cafe.app.backend.auth.application.port.out.LoadUserPort;
import com.new_cafe.app.backend.auth.domain.model.User;

import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * 로그인 유스케이스 구현체.
 */
@Service
public class LoginService implements LoginUseCase {

    private final LoadUserPort loadUserPort;
    private final GenerateTokenPort generateTokenPort;

    public LoginService(LoadUserPort loadUserPort, GenerateTokenPort generateTokenPort) {
        this.loadUserPort = loadUserPort;
        this.generateTokenPort = generateTokenPort;
    }

    @Override
    public AuthResult login(LoginCommand command) {

        // 1. username으로 유저 조회
        Optional<User> userOptional = loadUserPort.loadByUsername(command.getUsername());

        // 2. 유저 존재 여부 확인
        if (userOptional.isEmpty()) {
            throw new RuntimeException("존재하지 않는 사용자입니다.: " + command.getUsername());
        }

        User user = userOptional.get();

        // 3. 비밀번호 검증 로직
        boolean matches = user.matchesPassword(command.getPassword());
        System.out.println("[DEBUG] Login attempt - Username: " + command.getUsername() + ", Password Matches: " + matches);

        if (!matches) {
            throw new RuntimeException("비밀번호가 올바르지 않습니다.");
        }

        // 4. 토큰 생성 로직
        String token = generateTokenPort.generateToken(user);

        return new AuthResult(token, user.getUsername(), user.getRole());
    }
}
