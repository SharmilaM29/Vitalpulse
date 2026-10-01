package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Patient;

public interface PatientRepository
        extends JpaRepository<Patient, Long> {

    Optional<Patient> findByMedicalRecordNumber(
            String medicalRecordNumber
    );

    Optional<Patient> findByUser_Username(
            String username
    );
}
