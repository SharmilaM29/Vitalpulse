package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AuthDTO;
import com.example.demo.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public AuthDTO.RegisterRequest registerRequest(@RequestBody AuthDTO.RegisterRequest arr){
        return authService.registerRequest(arr);
    }

    @PostMapping("/login")
    public AuthDTO.LoginResponse loginRequest(@RequestBody AuthDTO.LoginRequest alr){
        return authService.loginRequest(alr);
    }
}
