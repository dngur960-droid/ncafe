package com.new_cafe.app.backend.dto;

import java.time.LocalDateTime;

<<<<<<< HEAD
import java.util.List;

=======
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuDetailResponse {
    private Long id;
    private String korName;
    private String engName;
    private String categoryName;
<<<<<<< HEAD
    private String price;
    private boolean isAvailable;
    private LocalDateTime createdAt;
    private String description;
    private List<MenuImageResponse> images;
=======
    private int price;
    private Boolean isAvailable;
    private LocalDateTime createdAt;
    private String description;
>>>>>>> acd0828dfdf61b419e0c5a38f70f4ab06fe7708e
}
