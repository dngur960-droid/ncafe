package com.new_cafe.app.backend.auth.application.port.in;

/**
 * [Inbound Port] 로그인 유스케이스 인터페이스.
 *
 * 컨트롤러(어댑터)는 이 인터페이스에만 의존하므로,
 * 서비스 구현체가 교체되어도 컨트롤러 코드는 변경 불필요.
 */
public interface LoginUseCase {

    /**
     * 로그인을 수행하고 인증 결과를 반환합니다.
     *
     * @param command 로그인 요청 (username, password)
     * @return 인증 결과 (token, role 등)
     * @throws RuntimeException 인증 실패 시
     */
    AuthResult login(LoginCommand command);
}
