package com.new_cafe.app.backend.repository;

import java.util.List;
import com.new_cafe.app.backend.entity.MenuImage;

public interface MenuImageRepository {
    List<MenuImage> findAllByMenuId(Long menuId);
<<<<<<< HEAD
    MenuImage save(MenuImage menuImage);
    void deleteById(Long id);
=======
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
}
