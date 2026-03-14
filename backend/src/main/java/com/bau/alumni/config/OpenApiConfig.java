package com.bau.alumni.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "BAU Alumni Network API",
                version = "1.0.0",
                description = "Mezun takip sistemi için geliştirilmiş RESTful API dokümantasyonu. Bu arayüz üzerinden tüm uç noktaları test edebilirsiniz.",
                contact = @Contact(
                        name = "Süleyman Mert Tunç",
                        email = "mert.tunc@bau.edu.tr"
                )
        )
)
public class OpenApiConfig {
}