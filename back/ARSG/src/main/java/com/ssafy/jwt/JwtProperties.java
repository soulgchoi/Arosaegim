package com.ssafy.jwt;

public class JwtProperties {
	// 약속된 키: String
	public static final String SECRET = "arsgtoken";
	// 유효성 만료 시간 ms: 30m * 60s * 1000ms
	public static final int EXPIRATION_TIME = 30 * 60 * 1000;
	// 일반적인 토큰 접두사
	public static final String TOKEN_PREFIX = "Bearer ";
	// 일반적인 인증 헤더
	public static final String HEADER_STRING = "Authorization";
}
