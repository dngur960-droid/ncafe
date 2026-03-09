package com.new_cafe.app.backend.auth.adapter.in.web;

import com.new_cafe.app.backend.auth.application.port.in.AuthResult;
import com.new_cafe.app.backend.auth.application.port.in.LoginCommand;
import com.new_cafe.app.backend.auth.application.port.in.LoginUseCase;
import com.new_cafe.app.backend.auth.application.port.in.ParseTokenUseCase;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * [Inbound Adapter] 인증 HTTP 컨트롤러.
 *
 * LoginUseCase 인터페이스에만 의존하므로
 * 서비스 구현체가 교체되어도 이 파일은 수정 불필요.
 *
 * 엔드포인트:
 *   POST /auth/login   - 로그인
 *   POST /auth/logout  - 로그아웃
 *   GET  /auth/me      - 현재 유저 정보 조회
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final ParseTokenUseCase parseTokenUseCase;

    public AuthController(LoginUseCase loginUseCase, ParseTokenUseCase parseTokenUseCase) {
        this.loginUseCase = loginUseCase;
        this.parseTokenUseCase = parseTokenUseCase;
    }

    /**
     * 로그인.
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            LoginCommand command = new LoginCommand(request.getUsername(), request.getPassword());
            AuthResult result = loginUseCase.login(command);

            LoginResponse response = new LoginResponse(
                    result.getToken(),
                    result.getUsername(),
                    result.getRole(),
                    "로그인에 성공했습니다."
            );
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            LoginResponse errorResponse = new LoginResponse(null, null, null, e.getMessage());
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

    /**
     * 로그아웃.
     * POST /api/auth/logout
     * TODO: 토큰 무효화 로직을 구현해주세요 (블랙리스트, 세션 삭제 등)
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // TODO: 세션/토큰 무효화 구현
        return ResponseEntity.ok().build();
    }

    /**
     * 현재 로그인 유저 정보 조회.
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<LoginResponse> me(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        try {
            AuthResult authResult = parseTokenUseCase.parseToken(authorizationHeader);
            
            // 토큰 정보로 유저 정보 리턴
            LoginResponse response = new LoginResponse(
                    null, // JWT 토큰은 다시 반환하지 않아도 됨
                    authResult.getUsername(),
                    authResult.getRole(),
                    "성공적으로 인증되었습니다."
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }
}
