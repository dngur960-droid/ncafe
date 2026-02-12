package com.new_cafe.app.backend.entity;

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
public class MenuImage {
    private Long id;
    private Long menuId;
<<<<<<< HEAD
    private String url;

=======
    private String srcUrl;
    private LocalDateTime createdAt;
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
    private Integer sortOrder;
}
