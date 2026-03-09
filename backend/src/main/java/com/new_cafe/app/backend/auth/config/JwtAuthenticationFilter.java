package com.new_cafe.app.backend.auth.config;

import com.new_cafe.app.backend.auth.application.port.in.AuthResult;
import com.new_cafe.app.backend.auth.application.port.in.ParseTokenUseCase;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * JWT 기반 인증 필터
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final ParseTokenUseCase parseTokenUseCase;

    public JwtAuthenticationFilter(ParseTokenUseCase parseTokenUseCase) {
        this.parseTokenUseCase = parseTokenUseCase;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            AuthResult authResult = parseTokenUseCase.parseToken(authHeader);

            if (authResult != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        authResult.getUsername(),
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority(authResult.getRole()))
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (Exception e) {
            // 토큰이 유효하지 않은 경우 무시하고 다음 필터로 진행 (SecurityConfig에서 권한 체크)
        }

        filterChain.doFilter(request, response);
    }
}
