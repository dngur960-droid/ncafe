package com.new_cafe.app.backend.menu.application.service;

import com.new_cafe.app.backend.menu.application.port.in.RegisterMenuUseCase;
import com.new_cafe.app.backend.menu.application.port.in.UpdateMenuUseCase;
import com.new_cafe.app.backend.admin.menu.adapter.in.web.res.MenuResult;
import com.new_cafe.app.backend.admin.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.SaveMenuPort;
import com.new_cafe.app.backend.admin.menu.application.port.out.DeleteMenuPort;
import com.new_cafe.app.backend.admin.menu.domain.model.Menu;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * [Application Service] 메뉴 커맨드(CUD) 서비스
 */
@Service
@Transactional
public class MenuCommandService {

    private final LoadMenuPort loadMenuPort;
    private final SaveMenuPort saveMenuPort;
    private final DeleteMenuPort deleteMenuPort;

    public MenuCommandService(LoadMenuPort loadMenuPort, SaveMenuPort saveMenuPort, DeleteMenuPort deleteMenuPort) {
        this.loadMenuPort = loadMenuPort;
        this.saveMenuPort = saveMenuPort;
        this.deleteMenuPort = deleteMenuPort;
    }

    public MenuResult.MenuId registerMenu(RegisterMenuUseCase command) {
        Menu menu = Menu.create(
                command.getKorName(), command.getEngName(), command.getDescription(),
                command.getPrice(), command.getCategoryId(),
                command.getIsAvailable(), command.getIsSoldOut(), command.getSortOrder()
        );
        Menu saved = saveMenuPort.save(menu);
        return new MenuResult.MenuId(saved.getId());
    }

    public MenuResult.MenuId updateMenu(UpdateMenuUseCase command) {
        Menu menu = loadMenuPort.findById(command.getId())
                .orElseThrow(() -> new RuntimeException("메뉴를 찾을 수 없습니다. id=" + command.getId()));

        menu.update(
                command.getKorName(), command.getEngName(), command.getDescription(),
                command.getPrice(), command.getCategoryId(),
                command.getIsAvailable(), command.getIsSoldOut(), command.getSortOrder()
        );
        Menu saved = saveMenuPort.save(menu);
        return new MenuResult.MenuId(saved.getId());
    }

    public void deleteMenu(Long id) {
        deleteMenuPort.deleteById(id);
    }
}
