package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.MedicalProfessional;

@Repository
public interface MedicalProfessionalRepository
        extends JpaRepository<MedicalProfessional, Long> {

    Optional<MedicalProfessional> findByEmployeeId(Long employeeId);

    Optional<MedicalProfessional> findByUser_Username(String username);
}
