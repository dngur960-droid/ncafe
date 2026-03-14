package com.new_cafe.app.backend.auth.application.service;

import com.new_cafe.app.backend.auth.application.port.in.RegisterUseCase;
import com.new_cafe.app.backend.auth.application.port.out.LoadUserPort;
import com.new_cafe.app.backend.auth.application.port.out.SaveUserPort;
import com.new_cafe.app.backend.auth.domain.model.User;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class RegisterService implements RegisterUseCase {

    private final LoadUserPort loadUserPort;
    private final SaveUserPort saveUserPort;

    public RegisterService(LoadUserPort loadUserPort, SaveUserPort saveUserPort) {
        this.loadUserPort = loadUserPort;
        this.saveUserPort = saveUserPort;
    }

    @Override
    public void register(RegisterCommand command) {
        // 1. 중복 체크
        if (loadUserPort.loadByUsername(command.getUsername()).isPresent()) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        // 2. 비밀번호 암호화
        String hashedPassword = BCrypt.hashpw(command.getPassword(), BCrypt.gensalt());

        // 3. 유저 생성 및 저장
        User user = new User(
                null,
                command.getUsername(),
                hashedPassword,
                "ROLE_USER", // 기본 역할은 ROLE_USER
                LocalDateTime.now()
        );

        saveUserPort.save(user);
    }
}
