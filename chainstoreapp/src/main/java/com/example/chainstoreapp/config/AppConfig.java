package com.example.chainstoreapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration // Javaアプリケーションやフレームワークの設定を行うクラスであることを示す

public class AppConfig {
	@Bean("restTemplate") // コンポーネントスキャン時にインスタンスが生成される
	public RestTemplate restTemplate() {
	    return new RestTemplate();
	}
}
