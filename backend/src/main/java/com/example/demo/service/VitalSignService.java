package com.example.demo.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.VitalSignDTO;
import com.example.demo.exception.EntityNotFoundException;
import com.example.demo.model.MedicalProfessional;
import com.example.demo.model.Patient;
import com.example.demo.model.VitalSign;
import com.example.demo.repository.MedicalProfessionalRepository;
import com.example.demo.repository.PatientRepository;
import com.example.demo.repository.VitalSignRepository;

@Service
public class VitalSignService {

    @Autowired
    private VitalSignRepository vitalSignRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicalProfessionalRepository mpr;

    private Authentication getAuthentication() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new AccessDeniedException(
                    "User is not authenticated."
            );
        }

        return authentication;
    }

    private boolean isAdmin() {

        return getAuthentication()
                .getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority()
                                .equals("ROLE_ADMIN")
                );
    }

    private boolean isDoctor() {

        return getAuthentication()
                .getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority()
                                .equals("ROLE_DOCTOR")
                );
    }

    private boolean isPatient() {

        return getAuthentication()
                .getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority()
                                .equals("ROLE_PATIENT")
                );
    }

    private MedicalProfessional getLoggedInDoctor() {

        String username =
                getAuthentication().getName();

        return mpr
                .findByUser_Username(username)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Medical professional profile not found."
                        )
                );
    }

    private Patient getLoggedInPatient() {

        String username =
                getAuthentication().getName();

        return patientRepository
                .findByUser_Username(username)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Patient profile not found."
                        )
                );
    }

    private boolean doctorOwnsPatient(
            Patient patient) {

        if (patient == null ||
                patient.getAssignedDoctor() == null) {

            return false;
        }

        MedicalProfessional doctor =
                getLoggedInDoctor();

        return patient
                .getAssignedDoctor()
                .getId()
                .equals(
                        doctor.getId()
                );
    }

    public String postVitalSign(
            VitalSignDTO.Request dto) {

        if (!isDoctor()) {

            throw new AccessDeniedException(
                    "Only doctors can record vital signs."
            );
        }

        Patient patient =
                patientRepository
                        .findById(
                                dto.getPatientId()
                        )
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Patient not found."
                                )
                        );

        if (!doctorOwnsPatient(patient)) {

            throw new AccessDeniedException(
                    "You are not allowed to add vital signs for this patient."
            );
        }

        VitalSign vitalSign =
                new VitalSign();

        vitalSign.setPatient(
                patient
        );

        vitalSign.setBloodPressure(
                dto.getBloodPressure()
        );

        vitalSign.setHeartRate(
                dto.getHeartRate()
        );

        vitalSign.setBodyTemperature(
                dto.getBodyTemperature()
        );

        vitalSign.setOxygenLevel(
                dto.getOxygenLevel()
        );

        vitalSign.setRecordedAt(
                dto.getRecordedAt()
        );

        vitalSignRepository.save(
                vitalSign
        );

        return "Vital sign recorded successfully.";
    }

    public List<VitalSignDTO.Response> getVitalSign() {

        List<VitalSign> vitalSigns;

        if (isAdmin()) {

            vitalSigns =
                    vitalSignRepository.findAll();

        } else if (isDoctor()) {

            MedicalProfessional doctor =
                    getLoggedInDoctor();

            vitalSigns =
                    vitalSignRepository
                            .findAll()
                            .stream()
                            .filter(vitalSign ->
                                    vitalSign.getPatient() != null
                                            &&
                                    vitalSign
                                            .getPatient()
                                            .getAssignedDoctor() != null
                                            &&
                                    vitalSign
                                            .getPatient()
                                            .getAssignedDoctor()
                                            .getId()
                                            .equals(
                                                    doctor.getId()
                                            )
                            )
                            .collect(
                                    Collectors.toList()
                            );

        } else if (isPatient()) {

            Patient patient =
                    getLoggedInPatient();

            vitalSigns =
                    vitalSignRepository
                            .findAll()
                            .stream()
                            .filter(vitalSign ->
                                    vitalSign.getPatient() != null
                                            &&
                                    vitalSign
                                            .getPatient()
                                            .getId()
                                            .equals(
                                                    patient.getId()
                                            )
                            )
                            .collect(
                                    Collectors.toList()
                            );

        } else {

            throw new AccessDeniedException(
                    "You are not allowed to view vital signs."
            );
        }

        Map<Long, VitalSign> latestVitals =
                vitalSigns
                        .stream()
                        .filter(vital ->
                                vital.getPatient() != null
                        )
                        .collect(
                                Collectors.toMap(
                                        vital ->
                                                vital
                                                        .getPatient()
                                                        .getId(),

                                        vital ->
                                                vital,

                                        (existing, replacement) ->
                                                getLatest(
                                                        existing,
                                                        replacement
                                                )
                                )
                        );

        return latestVitals
                .values()
                .stream()
                .map(
                        this::convertToResponse
                )
                .collect(
                        Collectors.toList()
                );
    }

    private VitalSign getLatest(
            VitalSign first,
            VitalSign second) {

        if (first.getRecordedAt() == null) {
            return second;
        }

        if (second.getRecordedAt() == null) {
            return first;
        }

        return first
                .getRecordedAt()
                .compareTo(
                        second.getRecordedAt()
                ) >= 0
                ? first
                : second;
    }

    public VitalSignDTO.Response getVitalSignbyid(
            Long id) {

        VitalSign vitalSign =
                vitalSignRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Vital sign not found."
                                )
                        );

        checkVitalAccess(
                vitalSign
        );

        return convertToResponse(
                vitalSign
        );
    }

    private void checkVitalAccess(
            VitalSign vitalSign) {

        if (isAdmin()) {
            return;
        }

        if (isDoctor()) {

            if (vitalSign.getPatient() == null ||
                    !doctorOwnsPatient(
                            vitalSign.getPatient()
                    )) {

                throw new AccessDeniedException(
                        "You are not allowed to access this vital sign."
                );
            }

            return;
        }

        if (isPatient()) {

            Patient patient =
                    getLoggedInPatient();

            if (vitalSign.getPatient() == null ||
                    !vitalSign
                            .getPatient()
                            .getId()
                            .equals(
                                    patient.getId()
                            )) {

                throw new AccessDeniedException(
                        "You are not allowed to access this vital sign."
                );
            }

            return;
        }

        throw new AccessDeniedException(
                "You are not allowed to access this vital sign."
        );
    }

    public String delete(
            Long id) {

        if (!isDoctor()) {

            throw new AccessDeniedException(
                    "Only doctors can delete vital signs."
            );
        }

        VitalSign vitalSign =
                vitalSignRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Vital sign not found."
                                )
                        );

        if (vitalSign.getPatient() == null ||
                !doctorOwnsPatient(
                        vitalSign.getPatient()
                )) {

            throw new AccessDeniedException(
                    "You are not allowed to delete this vital sign."
            );
        }

        vitalSignRepository.delete(
                vitalSign
        );

        return "Vital record deleted successfully.";
    }

    public String updateVitalSign(
            Long id,
            VitalSignDTO.Request dto) {

        if (!isDoctor()) {

            throw new AccessDeniedException(
                    "Only doctors can update vital signs."
            );
        }

        VitalSign vitalSign =
                vitalSignRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Vital sign not found."
                                )
                        );

        if (vitalSign.getPatient() == null ||
                !doctorOwnsPatient(
                        vitalSign.getPatient()
                )) {

            throw new AccessDeniedException(
                    "You are not allowed to update this vital sign."
            );
        }

        Patient patient =
                patientRepository
                        .findById(
                                dto.getPatientId()
                        )
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Patient not found."
                                )
                        );

        if (!doctorOwnsPatient(patient)) {

            throw new AccessDeniedException(
                    "You are not allowed to update this patient's vital signs."
            );
        }

        vitalSign.setPatient(
                patient
        );

        vitalSign.setBloodPressure(
                dto.getBloodPressure()
        );

        vitalSign.setHeartRate(
                dto.getHeartRate()
        );

        vitalSign.setBodyTemperature(
                dto.getBodyTemperature()
        );

        vitalSign.setOxygenLevel(
                dto.getOxygenLevel()
        );

        vitalSign.setRecordedAt(
                dto.getRecordedAt()
        );

        vitalSignRepository.save(
                vitalSign
        );

        return "Vital sign updated successfully.";
    }

    private VitalSignDTO.Response convertToResponse(
            VitalSign vitalSign) {

        VitalSignDTO.Response response =
                new VitalSignDTO.Response();

        response.setId(
                vitalSign.getId()
        );

        response.setHeartRate(
                vitalSign.getHeartRate()
        );

        response.setBloodPressure(
                vitalSign.getBloodPressure()
        );

        response.setBodyTemperature(
                vitalSign.getBodyTemperature()
        );

        response.setOxygenLevel(
                vitalSign.getOxygenLevel()
        );

        response.setRecordedAt(
                vitalSign.getRecordedAt()
        );

        if (vitalSign.getPatient() != null) {

            response.setPatient(
                    vitalSign
                            .getPatient()
                            .getFirstName()
                            + " "
                            + vitalSign
                                    .getPatient()
                                    .getLastName()
            );
        }

        return response;
    }
}