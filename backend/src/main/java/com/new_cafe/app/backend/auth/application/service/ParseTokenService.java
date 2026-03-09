package com.new_cafe.app.backend.auth.application.service;

import com.new_cafe.app.backend.auth.application.port.in.AuthResult;
import com.new_cafe.app.backend.auth.application.port.in.ParseTokenUseCase;
import com.new_cafe.app.backend.auth.application.port.out.ParseTokenPort;
import org.springframework.stereotype.Service;

@Service
public class ParseTokenService implements ParseTokenUseCase {

    private final ParseTokenPort parseTokenPort;

    public ParseTokenService(ParseTokenPort parseTokenPort) {
        this.parseTokenPort = parseTokenPort;
    }

    @Override
    public AuthResult parseToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new RuntimeException("토큰이 존재하지 않거나 형식이 올바르지 않습니다.");
        }

        String actualToken = token.substring(7); // "Bearer " 이후의 토큰 접두사 제거
        return parseTokenPort.parseToken(actualToken);
    }
}
