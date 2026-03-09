package com.new_cafe.app.backend.auth.application.port.in;

public interface ParseTokenUseCase {
    /**
     * 헤더의 Bearer 토큰 문자열을 검증하고, 추출된 유저 정보를 담은 AuthResult를 반환합니다.
     */
    AuthResult parseToken(String token);
}
