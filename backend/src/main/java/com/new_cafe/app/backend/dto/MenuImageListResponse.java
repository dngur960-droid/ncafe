package com.new_cafe.app.backend.dto;

import java.util.List;

<<<<<<< HEAD
=======
import com.new_cafe.app.backend.entity.MenuImage;

>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuImageListResponse {
    private List<MenuImageResponse> images;
}
