package com.new_cafe.app.backend.auth.application.port.out;

import com.new_cafe.app.backend.auth.domain.model.User;

/**
 * [Outbound Port] 유저 저장 포트 인터페이스.
 */
public interface SaveUserPort {
    /**
     * 유저를 저장합니다.
     * @param user 저장할 유저 정보
     * @return 저장된 유저 정보
     */
    User save(User user);
}
