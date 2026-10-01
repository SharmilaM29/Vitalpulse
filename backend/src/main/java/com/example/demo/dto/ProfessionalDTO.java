package com.example.demo.dto;

public class ProfessionalDTO {

    public static class Request {

        private String name;
        private String specialization;
        private Long employeeId;
        private String username;
        private String password;

        public Request() {
        }

        public Request(String name, String specialization, Long employeeId,
                       String username, String password) {
            this.name = name;
            this.specialization = specialization;
            this.employeeId = employeeId;
            this.username = username;
            this.password = password;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getSpecialization() {
            return specialization;
        }

        public void setSpecialization(String specialization) {
            this.specialization = specialization;
        }

        public Long getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(Long employeeId) {
            this.employeeId = employeeId;
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

    // =========================
    // RESPONSE DTO
    // =========================
    public static class Response {

        private Long id;
        private String name;
        private String specialization;
        private Long employeeId;
        private String username;
        private String role;

        public Response() {
        }

        public Response(Long id,
                        String name,
                        String specialization,
                        Long employeeId,
                        String username,
                        String role) {

            this.id = id;
            this.name = name;
            this.specialization = specialization;
            this.employeeId = employeeId;
            this.username = username;
            this.role = role;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getSpecialization() {
            return specialization;
        }

        public void setSpecialization(String specialization) {
            this.specialization = specialization;
        }

        public Long getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(Long employeeId) {
            this.employeeId = employeeId;
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
    }
}
