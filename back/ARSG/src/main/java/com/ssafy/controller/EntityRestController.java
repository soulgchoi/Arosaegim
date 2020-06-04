package com.ssafy.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dto.LoginFormDto;
import com.ssafy.dto.UserDto;
import com.ssafy.service.UserService;

import io.swagger.annotations.ApiOperation;

// 모든 RestController에서 공통으로 갖는 Methods
@RequestMapping()
public class EntityRestController {
	@Autowired
	private UserService userService;
	@ExceptionHandler
	public ResponseEntity<Map<String, Object>> handle(Exception e){
		return handleFail(e.getMessage(), HttpStatus.OK);
	}
	public ResponseEntity<Map<String, Object>> handleSuccess(Object data){
		if(data==null) return handleFail(data, HttpStatus.OK);
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("state", "success");
		resultMap.put("data", data);
		return new ResponseEntity<Map<String, Object>>(resultMap, HttpStatus.OK);
	}
	public ResponseEntity<Map<String, Object>> handleFail(Object data, HttpStatus state){
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("state", "fail");
		resultMap.put("data", data);
		return new ResponseEntity<Map<String,Object>>(resultMap, state); 
	}
//	@PostMapping("/login")
//	public ResponseEntity<Map<String, Object>> login(@RequestBody LoginFormDto loginFormDto) throws Exception{
//		UserDto tmp = userService.loginUser(loginFormDto);
//		if(tmp != null)
//			return handleSuccess(tmp);
//		else
//			return handleSuccess("login fail");
//	}
//	@ApiOperation("get 요청에 관한 인삿말을 출력한다")
//	@GetMapping("/")
//	public ResponseEntity<Map<String, Object>> postHello() throws Exception{
//		return handleSuccess("GET Hello World");
//	}
}
