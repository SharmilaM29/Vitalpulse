package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ProfessionalDTO;
import com.example.demo.service.MedicalProfessionalService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/professionals")
public class MedicalProfessionalController {

    @Autowired
    private MedicalProfessionalService service;

    // =========================
    // CREATE PROFESSIONAL
    // =========================
    @PostMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> create(
            @RequestBody @Valid ProfessionalDTO.Request mp) {

        service.create(mp);

        return ResponseEntity.ok(
                "Professional registered successfully."
        );
    }

    // =========================
    // GET ALL PROFESSIONALS
    // =========================
    @GetMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProfessionalDTO.Response>>
            getMedicalProfessional() {

        return ResponseEntity.ok(
                service.getMedicalProfessional()
        );
    }

    // =========================
    // GET MY PROFILE
    // =========================
    @GetMapping("/my-profile")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ProfessionalDTO.Response> getMyProfile() {

        return ResponseEntity.ok(
                service.getMyProfile()
        );
    }

    // =========================
    // GET PROFESSIONAL BY ID
    // =========================
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProfessionalDTO.Response>
            getMedicalProfessionalbyid(@PathVariable Long id) {

        return ResponseEntity.ok(
                service.getMedicalProfessionalbyid(id)
        );
    }

    // =========================
    // UPDATE PROFESSIONAL
    // =========================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String>
            updateMedicalProfessionalbyid(
                    @PathVariable Long id,
                    @RequestBody ProfessionalDTO.Request pdrr) {

        return ResponseEntity.ok(
                service.updateMedicalProfessionalbyid(id, pdrr)
        );
    }

    // =========================
    // DELETE PROFESSIONAL
    // =========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String>
            deleteMedicalProfessional(@PathVariable Long id) {

        return ResponseEntity.ok(
                service.deleteMedicalProfessional(id)
        );
    }
}
