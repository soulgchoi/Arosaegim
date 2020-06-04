/**
 * 
 */
package com.ssafy.configuration;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletContext;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import com.google.common.collect.Lists;
import com.ssafy.jwt.JwtProperties;

import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.paths.RelativePathProvider;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * @author 전경윤 Swagger의 설정
 */
@Configuration
@EnableSwagger2
public class SwaggerConfiguration extends WebMvcConfigurationSupport {
	@Bean
	public Docket productApi(ServletContext servletContext) {
		return new Docket(DocumentationType.SWAGGER_2)
				.pathProvider(new RelativePathProvider(servletContext) {
			        @Override
			        public String getApplicationBasePath() {
			            return "/api" + super.getApplicationBasePath();
			        }
			    })
//				.host("proxyURL")
				.securityContexts(Lists.newArrayList(securityContext()))
				.securitySchemes(Lists.newArrayList(apiKey()))
				.select().apis(RequestHandlerSelectors.basePackage("com.ssafy.controller")).paths(PathSelectors.any())
				.build();
	}

	@Override
	protected void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("swagger-ui.html").addResourceLocations("classpath:/META-INF/resources/");
		registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
	}

	// JWT 적용 후 추가 부분
	private ApiKey apiKey() {
		return new ApiKey("JWT", JwtProperties.HEADER_STRING, "header");
	}

	private springfox.documentation.spi.service.contexts.SecurityContext securityContext() {
		return springfox.documentation.spi.service.contexts.SecurityContext.builder().securityReferences(defaultAuth())
				.forPaths(PathSelectors.any()).build();
	}

	List<SecurityReference> defaultAuth() {
		AuthorizationScope authorizationScope = new AuthorizationScope("global", "accessEverything");
		AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
		authorizationScopes[0] = authorizationScope;
		return Lists.newArrayList(new SecurityReference("JWT", authorizationScopes));
	}
}
//	@Bean
//	public Docket api() {
//		return new Docket(DocumentationType.SWAGGER_2)
//				.select()
//				.apis(RequestHandlerSelectors.any())
//				.paths(PathSelectors.any()).build();
//	}

//	private String version;
//    private String title;
//
//    @Bean
//    public Docket apiV1() {
//        version = "V1";
//        title = "victolee API " + version;
//
//        return new Docket(DocumentationType.SWAGGER_2)
//                .useDefaultResponseMessages(false)
//                .groupName(version)
//                .select()
//                .apis(RequestHandlerSelectors.basePackage("com.victolee.swaggerexam.api.v1"))
//                .paths(PathSelectors.ant("/v1/api/**"))
//                .build()
//                .apiInfo(apiInfo(title, version));
//
//    }
//
//    @Bean
//    public Docket apiV2() {
//        version = "V2";
//        title = "victolee API " + version;
//
//        return new Docket(DocumentationType.SWAGGER_2)
//                .useDefaultResponseMessages(false)
//                .groupName(version)
//                .select()
//                .apis(RequestHandlerSelectors.basePackage("com.victolee.swaggerexam.api.v2"))
//                .paths(PathSelectors.ant("/v2/api/**"))
//                .build()
//                .apiInfo(apiInfo(title, version));
//
//    }
//
//    private ApiInfo apiInfo(String title, String version) {
//        return new ApiInfo(
//                title,
//                "Swagger로 생성한 API Docs",
//                version,
//                "www.example.com",
//                new Contact("Contact Me", "www.example.com", "foo@example.com"),
//                "Licenses",
//
//                "www.example.com",
//
//                new ArrayList<>());
//    }
