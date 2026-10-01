package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.PatientDTO;
import com.example.demo.model.MedicalProfessional;
import com.example.demo.model.Patient;
import com.example.demo.repository.MedicalProfessionalRepository;
import com.example.demo.repository.PatientRepository;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicalProfessionalRepository medicalProfessionalRepository;

    public PatientService() {
    }

    public PatientService(
            PatientRepository patientRepository,
            MedicalProfessionalRepository medicalProfessionalRepository) {

        this.patientRepository = patientRepository;
        this.medicalProfessionalRepository =
                medicalProfessionalRepository;
    }

    public PatientDTO.Response createPatient(
            PatientDTO.Request request) {

        if (request == null) {
            throw new RuntimeException(
                    "Patient request cannot be null.");
        }

        if (request.getMedicalRecordNumber() != null
                && patientRepository
                        .findByMedicalRecordNumber(
                                request.getMedicalRecordNumber())
                        .isPresent()) {

            throw new RuntimeException(
                    "Medical record number already exists.");
        }

        Patient patient = new Patient();

        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setMedicalRecordNumber(
                request.getMedicalRecordNumber());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setEmail(request.getEmail());
        patient.setPhone(request.getPhone());
        patient.setStatus(request.getStatus());

        if (request.getDoctorid() != null) {

            MedicalProfessional doctor =
                    medicalProfessionalRepository
                            .findById(request.getDoctorid())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Doctor not found."));

            patient.setAssignedDoctor(doctor);
        }

        Patient savedPatient =
                patientRepository.save(patient);

        return toResponse(savedPatient);
    }

    public List<PatientDTO.Response> getAllPatients() {

        return patientRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PatientDTO.Response> getPatientsByDoctor(
            String username) {

        MedicalProfessional doctor =
                medicalProfessionalRepository
                        .findByUser_Username(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Medical professional not found "
                                                + "with username: "
                                                + username));

        return patientRepository.findAll()
                .stream()
                .filter(patient ->
                        patient.getAssignedDoctor() != null
                                && patient.getAssignedDoctor()
                                        .getId()
                                        .equals(doctor.getId()))
                .map(this::toResponse)
                .toList();
    }

    public PatientDTO.Response getMyProfile() {

        String username =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        Patient patient =
                patientRepository
                        .findByUser_Username(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient profile not found."));

        return toResponse(patient);
    }

    public PatientDTO.Response getPatientById(Long id) {

        Patient patient =
                patientRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient not found with id: "
                                                + id));

        return toResponse(patient);
    }

    public PatientDTO.Response updatePatient(
            Long id,
            PatientDTO.Request request) {

        if (request == null) {
            throw new RuntimeException(
                    "Patient request cannot be null.");
        }

        Patient patient =
                patientRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient not found with id: "
                                                + id));

        if (request.getMedicalRecordNumber() != null
                && !request.getMedicalRecordNumber()
                        .equals(
                                patient.getMedicalRecordNumber())) {

            if (patientRepository
                    .findByMedicalRecordNumber(
                            request.getMedicalRecordNumber())
                    .isPresent()) {

                throw new RuntimeException(
                        "Medical record number already exists.");
            }

            patient.setMedicalRecordNumber(
                    request.getMedicalRecordNumber());
        }

        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setEmail(request.getEmail());
        patient.setPhone(request.getPhone());
        patient.setStatus(request.getStatus());

        if (request.getDoctorid() != null) {

            MedicalProfessional doctor =
                    medicalProfessionalRepository
                            .findById(request.getDoctorid())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Doctor not found."));

            patient.setAssignedDoctor(doctor);

        } else {

            patient.setAssignedDoctor(null);
        }

        Patient updatedPatient =
                patientRepository.save(patient);

        return toResponse(updatedPatient);
    }

    @Transactional
    public String deletePatient(Long id) {

        patientRepository.deleteById(id);

        return "Patient deleted successfully.";
    }

    public PatientDTO.Response assignDoctor(
            Long patientId,
            String username) {

        Patient patient =
                patientRepository.findById(patientId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient not found with id: "
                                                + patientId));

        MedicalProfessional doctor =
                medicalProfessionalRepository
                        .findByUser_Username(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Medical professional not found "
                                                + "with username: "
                                                + username));

        patient.setAssignedDoctor(doctor);

        Patient savedPatient =
                patientRepository.save(patient);

        return toResponse(savedPatient);
    }

    public PatientDTO.Response getPatientByIdForDoctor(
            Long id,
            String username) {

        Patient patient =
                patientRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient not found with id: "
                                                + id));

        MedicalProfessional doctor =
                medicalProfessionalRepository
                        .findByUser_Username(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Medical professional not found "
                                                + "with username: "
                                                + username));

        if (patient.getAssignedDoctor() == null
                || !patient.getAssignedDoctor()
                        .getId()
                        .equals(doctor.getId())) {

            throw new RuntimeException(
                    "You are not authorized to access this patient");
        }

        return toResponse(patient);
    }

    private PatientDTO.Response toResponse(
            Patient patient) {

        PatientDTO.Response response =
                new PatientDTO.Response();

        response.setId(patient.getId());

        response.setFirstName(
                patient.getFirstName());

        response.setLastName(
                patient.getLastName());

        response.setMedicalRecordNumber(
                patient.getMedicalRecordNumber());

        response.setDateOfBirth(
                patient.getDateOfBirth());

        response.setGender(
                patient.getGender());

        response.setEmail(
                patient.getEmail());

        response.setPhone(
                patient.getPhone());

        response.setStatus(
                patient.getStatus());

        if (patient.getAssignedDoctor() != null) {

            MedicalProfessional doctor =
                    patient.getAssignedDoctor();

            if (doctor.getUser() != null) {

                response.setDoctorName(
                        doctor.getUser().getFullName());
            }

            response.setDoctorSpecialization(
                    doctor.getSpecialization());
        }

        return response;
    }
}