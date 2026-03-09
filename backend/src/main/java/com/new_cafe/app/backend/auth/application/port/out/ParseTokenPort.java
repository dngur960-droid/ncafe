package com.new_cafe.app.backend.auth.application.port.out;

import com.new_cafe.app.backend.auth.application.port.in.AuthResult;

public interface ParseTokenPort {
    /**
     * 인증 토큰을 검증하고, 추출된 유저 정보를 반환합니다.
     * 유효하지 않은 경우 예외(RuntimeException 등)를 던집니다.
     */
    AuthResult parseToken(String token);
}
