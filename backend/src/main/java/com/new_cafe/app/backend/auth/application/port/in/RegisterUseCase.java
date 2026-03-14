package com.new_cafe.app.backend.auth.application.port.in;

/**
 * [Inbound Port] 회원가입 UseCase 인터페이스.
 */
public interface RegisterUseCase {
    void register(RegisterCommand command);

    class RegisterCommand {
        private final String username;
        private final String password;

        public RegisterCommand(String username, String password) {
            this.username = username;
            this.password = password;
        }

        public String getUsername() { return username; }
        public String getPassword() { return password; }
    }
}
