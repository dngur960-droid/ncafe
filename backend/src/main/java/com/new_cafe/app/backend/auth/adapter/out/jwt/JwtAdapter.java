package com.new_cafe.app.backend.auth.adapter.out.jwt;

import com.new_cafe.app.backend.auth.application.port.in.AuthResult;
import com.new_cafe.app.backend.auth.application.port.out.GenerateTokenPort;
import com.new_cafe.app.backend.auth.application.port.out.ParseTokenPort;
import com.new_cafe.app.backend.auth.domain.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * [Outbound Adapter] JWT 기반 토큰 생성 및 파싱.
 */
@Component
public class JwtAdapter implements GenerateTokenPort, ParseTokenPort {

    private final SecretKey key;
    private final long expirationTime;

    public JwtAdapter(
            @Value("${jwt.secret:defaultSecretKeyForLocalTestingWhichShouldBeAtLeast32BytesLong}") String secret,
            @Value("${jwt.expiration:3600000}") long expirationTime
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationTime = expirationTime;
    }

    @Override
    public String generateToken(User user) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(user.getUsername())
                .claim("role", user.getRole())
                .issuedAt(new Date(now))
                .expiration(new Date(now + expirationTime))
                .signWith(key)
                .compact();
    }

    @Override
    public AuthResult parseToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String username = claims.getSubject();
            String role = claims.get("role", String.class);

            // 반환 시 token 값은 다시 사용할 필요가 없으므로 null 또는 빈 문자열을 전달해도 무방합니다.
            return new AuthResult(token, username, role);

        } catch (Exception e) {
            throw new RuntimeException("유효하지 않은 토큰입니다.", e);
        }
    }
}
