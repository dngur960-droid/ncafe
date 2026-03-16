package com.new_cafe.app.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000") // 개발 환경
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry registry) {
        // ✅ /images/** 요청을 프로젝트 루트의 upload 폴더와 매핑 (로컬 및 도커 환경 모두 지원)
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:upload/", "file:./upload/", "file:/app/upload/");
    }
}
