package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.PatientDTO;
import com.example.demo.service.PatientService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createPatient(
            @RequestBody
            @Valid
            PatientDTO.Request pdr) {

        patientService.createPatient(pdr);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Patient created successfully.");
    }

    @GetMapping("/")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ResponseEntity<List<PatientDTO.Response>> getAllPatients() {

        return ResponseEntity.ok(
                patientService.getAllPatients()
        );
    }

    @GetMapping("/my-patients")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<PatientDTO.Response>> getMyPatients() {

        return ResponseEntity.ok(
                patientService.getPatientsByDoctor(
                        getLoggedInUsername()
                )
        );
    }

    @GetMapping("/my-profile")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<PatientDTO.Response> getMyProfile() {

        return ResponseEntity.ok(
                patientService.getMyProfile()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ResponseEntity<PatientDTO.Response> getPatientById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                patientService.getPatientById(id)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updatePatient(
            @PathVariable Long id,
            @RequestBody
            @Valid
            PatientDTO.Request pdr) {

        patientService.updatePatient(id, pdr);

        return ResponseEntity.ok(
                "Patient updated successfully."
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deletePatient(
            @PathVariable Long id) {

        patientService.deletePatient(id);

        return ResponseEntity.ok(
                "Patient deleted successfully."
        );
    }

    private String getLoggedInUsername() {

        return org.springframework.security.core.context
                .SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }
}