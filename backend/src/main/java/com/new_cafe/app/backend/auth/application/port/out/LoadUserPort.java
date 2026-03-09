package com.new_cafe.app.backend.auth.application.port.out;

import com.new_cafe.app.backend.auth.domain.model.User;
import java.util.Optional;

/**
 * [Outbound Port] 유저 조회 포트 인터페이스.
 *
 * 서비스(application layer)는 이 인터페이스에만 의존하므로,
 * 실제 DB 구현체가 바뀌어도(PostgreSQL → MongoDB 등) 서비스 코드는 변경 불필요.
 */
public interface LoadUserPort {

    /**
     * username으로 유저를 조회합니다.
     *
     * @param username 로그인 ID
     * @return 유저 (없으면 Optional.empty())
     */
    Optional<User> loadByUsername(String username);
}
