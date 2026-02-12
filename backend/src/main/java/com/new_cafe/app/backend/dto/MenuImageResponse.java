package com.new_cafe.app.backend.dto;

<<<<<<< HEAD
=======
import java.time.LocalDateTime;

>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuImageResponse {
    private Long id;
<<<<<<< HEAD
    private String url;
    private Integer sortOrder;
    private String altText;
=======
    private Long menuId;
    private String srcUrl;
    private LocalDateTime createdAt;
    private Integer sortOrder;
    private String altText; // 메뉴 이름 등을 사용할 예정
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
}
