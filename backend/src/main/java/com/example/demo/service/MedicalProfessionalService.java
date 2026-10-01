package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.ProfessionalDTO;
import com.example.demo.exception.EntityNotFoundException;
import com.example.demo.model.MedicalProfessional;
import com.example.demo.model.User;
import com.example.demo.repository.MedicalProfessionalRepository;
import com.example.demo.repository.UserRepository;

@Service
public class MedicalProfessionalService {

    @Autowired
    private MedicalProfessionalRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String create(ProfessionalDTO.Request dto) {

        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {

            throw new IllegalArgumentException(
                    "Username already exists: " + dto.getUsername()
            );
        }

        User user = new User();

        user.setUsername(dto.getUsername());

        user.setPassword(
                passwordEncoder.encode(
                        dto.getPassword()
                )
        );

        user.setRole("DOCTOR");

        user.setFullName(
                dto.getName()
        );

        userRepository.save(user);

        MedicalProfessional medicalProfessional =
                new MedicalProfessional();

        medicalProfessional.setName(
                dto.getName()
        );

        medicalProfessional.setSpecialization(
                dto.getSpecialization()
        );

        medicalProfessional.setEmployeeId(
                dto.getEmployeeId()
        );

        medicalProfessional.setUser(
                user
        );

        repository.save(
                medicalProfessional
        );

        return "Professional registered successfully.";
    }

    public List<ProfessionalDTO.Response>
            getMedicalProfessional() {

        return repository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ProfessionalDTO.Response
            getMedicalProfessionalbyid(Long id) {

        MedicalProfessional professional =
                repository.findById(id)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Professional not found."
                                )
                        );

        return convertToResponse(
                professional
        );
    }

    public String updateMedicalProfessionalbyid(
            Long id,
            ProfessionalDTO.Request pdrr) {

        MedicalProfessional medicalProfessional =
                repository.findById(id)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Professional not found."
                                )
                        );

        medicalProfessional.setName(
                pdrr.getName()
        );

        medicalProfessional.setSpecialization(
                pdrr.getSpecialization()
        );

        medicalProfessional.setEmployeeId(
                pdrr.getEmployeeId()
        );

        repository.save(
                medicalProfessional
        );

        return "Professional updated successfully";
    }

    public String deleteMedicalProfessional(
            Long id) {

        MedicalProfessional professional =
                repository.findById(id)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Professional not found."
                                )
                        );

        repository.delete(
                professional
        );

        return "Professional deleted successfully";
    }

    public ProfessionalDTO.Response getMyProfile() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username =
                authentication.getName();

        MedicalProfessional professional =
                repository.findByUser_Username(
                        username
                )
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Professional profile not found."
                        )
                );

        return convertToResponse(
                professional
        );
    }

    private ProfessionalDTO.Response
            convertToResponse(
                    MedicalProfessional professional) {

        String username = null;
        String role = null;

        if (professional.getUser() != null) {

            username =
                    professional.getUser()
                            .getUsername();

            role =
                    professional.getUser()
                            .getRole();
        }

        return new ProfessionalDTO.Response(
                professional.getId(),
                professional.getName(),
                professional.getSpecialization(),
                professional.getEmployeeId(),
                username,
                role
        );
    }
}