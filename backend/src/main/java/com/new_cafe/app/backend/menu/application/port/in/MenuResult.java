package com.new_cafe.app.backend.menu.application.port.in;

import com.new_cafe.app.backend.menu.domain.model.Menu;
import com.new_cafe.app.backend.menu.domain.model.MenuImage;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * [Inbound Port] UseCase 결과 DTO 모음
 */
public class MenuResult {

    // ─── 목록 ───
    public record MenuSummary(
            Long id, String korName, String engName, String description,
            Integer price, String categoryName, String imageSrc,
            Boolean isAvailable, Boolean isSoldOut, Integer sortOrder, // Added isSoldOut
            LocalDateTime createdAt, LocalDateTime updatedAt
    ) {
        public static MenuSummary from(Menu menu, String categoryName) {
            return new MenuSummary(
                    menu.getId(), menu.getKorName(), menu.getEngName(),
                    menu.getDescription(), menu.getPrice(),
                    categoryName, menu.thumbnailSrc(),
                    menu.getIsAvailable() != null ? menu.getIsAvailable() : true,
                    menu.getIsSoldOut() != null ? menu.getIsSoldOut() : false, // isSoldOut
                    menu.getSortOrder() != null ? menu.getSortOrder() : 1,
                    menu.getCreatedAt(), menu.getUpdatedAt()
            );
        }
    }

    public record MenuList(List<MenuSummary> menus, int total) {}

    // ─── 상세 ───
    public record ImageInfo(
            Long id, Long menuId, String srcUrl, LocalDateTime createdAt, Integer sortOrder, String altText
    ) {
        public static ImageInfo from(MenuImage img, String altText) {
            return new ImageInfo(img.getId(), img.getMenuId(), img.getSrcUrl(), img.getCreatedAt(), img.getSortOrder(), altText);
        }
    }

    public record MenuDetail(
            Long id, String korName, String engName, String categoryName,
            String price, Boolean isAvailable, Boolean isSoldOut, LocalDateTime createdAt,
            String description, List<ImageInfo> images
    ) {
        public static MenuDetail from(Menu menu, String categoryName, List<MenuImage> images) {
            List<ImageInfo> imageInfos = images.stream()
                    .map(img -> ImageInfo.from(img, menu.getKorName()))
                    .collect(Collectors.toList());
            return new MenuDetail(
                    menu.getId(), menu.getKorName(), menu.getEngName(),
                    categoryName,
                    menu.getPrice() != null ? menu.getPrice().toString() : "0",
                    menu.getIsAvailable() != null ? menu.getIsAvailable() : true,
                    menu.getIsSoldOut() != null ? menu.getIsSoldOut() : false,
                    menu.getCreatedAt(), menu.getDescription(), imageInfos
            );
        }
    }

    // ─── 생성/수정 결과 ───
    public record MenuId(Long id) {}

    // ─── 이미지 목록 ───
    public record ImageList(List<ImageInfo> images) {}
}
