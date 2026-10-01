package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class PatientDTO {

    // =========================================================
    // REQUEST DTO
    // =========================================================

    public static class Request {

        @NotBlank(message = "First name is required.")
        private String firstName;

        @NotBlank(message = "Last name is required.")
        private String lastName;

        @NotBlank(message = "Medical record number is required.")
        private String medicalRecordNumber;

        @NotBlank(message = "Date of birth is required.")
        private String dateOfBirth;

        private String gender;

        @Email(message = "Enter a valid email address.")
        private String email;

        private String phone;

        @NotBlank(message = "Patient status is required.")
        private String status;

        private Long doctorid;

        // =====================================================
        // CONSTRUCTORS
        // =====================================================

        public Request() {
        }

        public Request(
                String firstName,
                String lastName,
                String medicalRecordNumber,
                String dateOfBirth,
                Long doctorid) {

            this.firstName = firstName;
            this.lastName = lastName;
            this.medicalRecordNumber = medicalRecordNumber;
            this.dateOfBirth = dateOfBirth;
            this.doctorid = doctorid;
        }

        // =====================================================
        // GETTERS / SETTERS
        // =====================================================

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getMedicalRecordNumber() {
            return medicalRecordNumber;
        }

        public void setMedicalRecordNumber(String medicalRecordNumber) {
            this.medicalRecordNumber = medicalRecordNumber;
        }

        public String getDateOfBirth() {
            return dateOfBirth;
        }

        public void setDateOfBirth(String dateOfBirth) {
            this.dateOfBirth = dateOfBirth;
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

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public Long getDoctorid() {
            return doctorid;
        }

        public void setDoctorid(Long doctorid) {
            this.doctorid = doctorid;
        }
    }

    // =========================================================
    // RESPONSE DTO
    // =========================================================

    public static class Response {

        private Long id;
        private String firstName;
        private String lastName;
        private String medicalRecordNumber;
        private String dateOfBirth;
        private String gender;
        private String email;
        private String phone;
        private String status;
        private String doctorName;
        private String doctorSpecialization;

        // =====================================================
        // CONSTRUCTORS
        // =====================================================

        public Response() {
        }

        /*
         * Legacy constructor required by the validation tests.
         * Keep this even though the application now has more
         * response fields.
         */
        public Response(
                Long id,
                String firstName,
                String lastName,
                String medicalRecordNumber,
                String dateOfBirth,
                String doctorName) {

            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.medicalRecordNumber = medicalRecordNumber;
            this.dateOfBirth = dateOfBirth;
            this.doctorName = doctorName;
        }

        // =====================================================
        // GETTERS / SETTERS
        // =====================================================

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getMedicalRecordNumber() {
            return medicalRecordNumber;
        }

        public void setMedicalRecordNumber(String medicalRecordNumber) {
            this.medicalRecordNumber = medicalRecordNumber;
        }

        public String getDateOfBirth() {
            return dateOfBirth;
        }

        public void setDateOfBirth(String dateOfBirth) {
            this.dateOfBirth = dateOfBirth;
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

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getDoctorName() {
            return doctorName;
        }

        public void setDoctorName(String doctorName) {
            this.doctorName = doctorName;
        }

        public String getDoctorSpecialization() {
            return doctorSpecialization;
        }

        public void setDoctorSpecialization(String doctorSpecialization) {
            this.doctorSpecialization = doctorSpecialization;
        }
    }
}
