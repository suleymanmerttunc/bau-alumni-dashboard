package com.bau.alumni.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	
	// Şimdilik böyle PROD ortamına geçtiğimiz zaman burası güncellenecek.
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Tüm endpointlere izin ver Burayı da frontendi düzenleyince api koyarız başına şimdilik kalabilir
                .allowedOrigins("http://localhost:5173") // Sadece React'in çalışacağı adrese izin ver
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") 
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}