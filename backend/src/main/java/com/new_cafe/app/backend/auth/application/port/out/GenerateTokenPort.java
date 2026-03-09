package com.new_cafe.app.backend.auth.application.port.out;

import com.new_cafe.app.backend.auth.domain.model.User;

public interface GenerateTokenPort {
    /**
     * 유저 정보를 기반으로 인증 토큰을 생성합니다.
     */
    String generateToken(User user);
}
