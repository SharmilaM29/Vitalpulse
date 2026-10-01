package com.example.demo.dto;

public class AuthDTO {

    public static class RegisterRequest {

        private String username;
        private String password;
        private String role;
        private String fullName;
        private String gender;
        private String email;
        private String phone;

        public RegisterRequest() {
        }

        public RegisterRequest(
                String username,
                String password,
                String role,
                String fullName,
                String gender,
                String email,
                String phone) {

            this.username = username;
            this.password = password;
            this.role = role;
            this.fullName = fullName;
            this.gender = gender;
            this.email = email;
            this.phone = phone;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }
    }

    public static class LoginRequest {

        private String token;
        private String username;
        private String password;

        public LoginRequest() {
        }

        public LoginRequest(
                String username,
                String password,
                String token) {

            this.username = username;
            this.password = password;
            this.token = token;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class LoginResponse {

        private String token;
        private String username;
        private String role;
        private String fullName;
        private String gender;
        private String email;
        private String phone;

        public LoginResponse() {
        }

        public LoginResponse(
                String token,
                String username,
                String role,
                String fullName,
                String gender,
                String email,
                String phone) {

            this.token = token;
            this.username = username;
            this.role = role;
            this.fullName = fullName;
            this.gender = gender;
            this.email = email;
            this.phone = phone;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }
    }
}
