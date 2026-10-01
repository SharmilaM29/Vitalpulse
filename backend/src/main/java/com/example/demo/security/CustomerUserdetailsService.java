package com.example.demo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@Service
public class CustomerUserdetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Username not found: " + username
                        )
                );

        // Make role safe.
        // Database can contain ADMIN or ROLE_ADMIN.
        String role = user.getRole();

        if (role == null || role.trim().isEmpty()) {
            throw new UsernameNotFoundException(
                    "User role is missing for: " + username
            );
        }

        role = role.trim().toUpperCase();

        // Spring's .roles() automatically adds ROLE_
        // Therefore remove ROLE_ if it already exists.
        if (role.startsWith("ROLE_")) {
            role = role.substring(5);
        }

        System.out.println(
                "DEBUG USER: " + user.getUsername()
                + " | DATABASE ROLE: " + user.getRole()
                + " | SPRING ROLE: ROLE_" + role
        );

        return org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(role)
                .build();
    }
}
