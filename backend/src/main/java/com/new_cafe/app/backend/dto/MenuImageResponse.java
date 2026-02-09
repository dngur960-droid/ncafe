package com.new_cafe.app.backend.dto;

import java.time.LocalDateTime;

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
    private Long menuId;
    private String srcUrl;
    private LocalDateTime createdAt;
    private Integer sortOrder;
    private String altText; // 메뉴 이름 등을 사용할 예정
}
