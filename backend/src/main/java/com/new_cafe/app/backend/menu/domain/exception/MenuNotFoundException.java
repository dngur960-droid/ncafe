package com.new_cafe.app.backend.menu.domain.exception;

public class MenuNotFoundException extends RuntimeException {
    public MenuNotFoundException(Long id) {
        super("Menu not found with id: " + id);
    }
}
