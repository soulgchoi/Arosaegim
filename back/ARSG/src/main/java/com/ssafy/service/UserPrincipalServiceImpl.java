package com.ssafy.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ssafy.entity.User;
import com.ssafy.jwt.UserPrincipal;
import com.ssafy.repositories.UserRepository;

@Service
public class UserPrincipalServiceImpl implements UserDetailsService{
	@Autowired
	private UserRepository userRepository;
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(email);
		UserPrincipal userPrincipal = new UserPrincipal(user);
		
		return userPrincipal;
	}

}
