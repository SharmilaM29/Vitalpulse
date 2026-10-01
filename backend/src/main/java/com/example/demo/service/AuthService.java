package com.example.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AuthDTO;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthDTO.RegisterRequest registerRequest(
            AuthDTO.RegisterRequest arr) {

        User user = new User();

        user.setUsername(arr.getUsername());
        user.setPassword(
                passwordEncoder.encode(arr.getPassword())
        );
        user.setRole(arr.getRole());
        user.setFullName(arr.getFullName());
        user.setGender(arr.getGender());
        user.setEmail(arr.getEmail());
        user.setPhone(arr.getPhone());

        User savedUser = userRepository.save(user);

        return new AuthDTO.RegisterRequest(
                savedUser.getUsername(),
                savedUser.getPassword(),
                savedUser.getRole(),
                savedUser.getFullName(),
                savedUser.getGender(),
                savedUser.getEmail(),
                savedUser.getPhone()
        );
    }

    public AuthDTO.LoginResponse loginRequest(
            AuthDTO.LoginRequest alr) {

        Optional<User> optionalUser =
                userRepository.findByUsername(
                        alr.getUsername()
                );

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(
                alr.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid password");
        }

        String token =
                jwtUtil.generateToken(user.getUsername());

        return new AuthDTO.LoginResponse(
                token,
                user.getUsername(),
                user.getRole(),
                user.getFullName(),
                user.getGender(),
                user.getEmail(),
                user.getPhone()
        );
    }
}