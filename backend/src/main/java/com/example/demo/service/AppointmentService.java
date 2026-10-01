package com.example.demo.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AppointmentDTO;
import com.example.demo.dto.AppointmentDTO.Request;
import com.example.demo.exception.EntityNotFoundException;
import com.example.demo.model.Appointment;
import com.example.demo.model.MedicalProfessional;
import com.example.demo.model.Patient;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.MedicalProfessionalRepository;
import com.example.demo.repository.PatientRepository;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository apr;

    @Autowired
    private PatientRepository pr;

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

        return pr
                .findByUser_Username(username)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Patient profile not found."
                        )
                );
    }

    private void checkDoctorOwnsPatient(
            Patient patient) {

        if (patient == null ||
                patient.getAssignedDoctor() == null) {

            throw new AccessDeniedException(
                    "Patient is not assigned to a doctor."
            );
        }

        MedicalProfessional doctor =
                getLoggedInDoctor();

        if (!patient
                .getAssignedDoctor()
                .getId()
                .equals(doctor.getId())) {

            throw new AccessDeniedException(
                    "You are not allowed to access this patient."
            );
        }
    }

    public String createAppointment(
            Request apdr) {

        if (!isAdmin()) {

            throw new AccessDeniedException(
                    "Only admin can create appointments."
            );
        }

        Appointment appointment =
                new Appointment();

        appointment.setAppointmentDate(
                apdr.getAppointmentDate()
        );

        Patient patient =
                pr.findById(
                        apdr.getPatientId()
                )
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Patient not found."
                        )
                );

        appointment.setPatient(
                patient
        );

        MedicalProfessional professional =
                mpr.findById(
                        apdr.getProfessionalId()
                )
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Medical professional not found."
                        )
                );

        appointment.setProfessional(
                professional
        );

        appointment.setConsultationReason(
                apdr.getReason()
        );

        appointment.setStatus(
                "PENDING"
        );

        apr.save(
                appointment
        );

        return "Appointment scheduled successfully.";
    }

    public List<AppointmentDTO.Response> getAll() {

        List<Appointment> appointments;

        if (isAdmin()) {

            appointments =
                    apr.findAll();

        } else if (isDoctor()) {

            MedicalProfessional doctor =
                    getLoggedInDoctor();

            appointments =
                    apr.findAll()
                            .stream()
                            .filter(appointment ->
                                    appointment.getProfessional() != null
                                            &&
                                    appointment
                                            .getProfessional()
                                            .getId()
                                            .equals(
                                                    doctor.getId()
                                            )
                            )
                            .toList();

        } else if (isPatient()) {

            Patient patient =
                    getLoggedInPatient();

            appointments =
                    apr.findAll()
                            .stream()
                            .filter(appointment ->
                                    appointment.getPatient() != null
                                            &&
                                    appointment
                                            .getPatient()
                                            .getId()
                                            .equals(
                                                    patient.getId()
                                            )
                            )
                            .toList();

        } else {

            throw new AccessDeniedException(
                    "You are not allowed to view appointments."
            );
        }

        List<AppointmentDTO.Response> responses =
                new ArrayList<>();

        for (Appointment appointment :
                appointments) {

            responses.add(
                    convertToResponse(
                            appointment
                    )
            );
        }

        return responses;
    }

    public AppointmentDTO.Response getById(
            Long id) {

        Appointment appointment =
                apr.findById(id)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Appointment not found."
                                )
                        );

        if (isAdmin()) {

            return convertToResponse(
                    appointment
            );
        }

        if (isDoctor()) {

            MedicalProfessional doctor =
                    getLoggedInDoctor();

            if (appointment.getProfessional() == null ||
                    !appointment
                            .getProfessional()
                            .getId()
                            .equals(
                                    doctor.getId()
                            )) {

                throw new AccessDeniedException(
                        "You are not allowed to access this appointment."
                );
            }

        } else if (isPatient()) {

            Patient patient =
                    getLoggedInPatient();

            if (appointment.getPatient() == null ||
                    !appointment
                            .getPatient()
                            .getId()
                            .equals(
                                    patient.getId()
                            )) {

                throw new AccessDeniedException(
                        "You are not allowed to access this appointment."
                );
            }

        } else {

            throw new AccessDeniedException(
                    "You are not allowed to access this appointment."
            );
        }

        return convertToResponse(
                appointment
        );
    }

    public String approve(
            Long id) {

        Appointment appointment =
                getDoctorAppointment(id);

        if ("APPROVED".equals(
                appointment.getStatus()
        )) {

            return "Appointment is already approved.";
        }

        if ("CANCELLED".equals(
                appointment.getStatus()
        )) {

            throw new IllegalStateException(
                    "Cancelled appointment cannot be approved."
            );
        }

        appointment.setStatus(
                "APPROVED"
        );

        apr.save(
                appointment
        );

        return "Appointment approved successfully.";
    }

    public String cancel(
            Long id) {

        Appointment appointment =
                getDoctorAppointment(id);

        if ("CANCELLED".equals(
                appointment.getStatus()
        )) {

            return "Appointment is already cancelled.";
        }

        if ("APPROVED".equals(
                appointment.getStatus()
        )) {

            throw new IllegalStateException(
                    "Approved appointment cannot be cancelled."
            );
        }

        appointment.setStatus(
                "CANCELLED"
        );

        apr.save(
                appointment
        );

        return "Appointment cancelled successfully.";
    }

    private Appointment getDoctorAppointment(
            Long id) {

        Appointment appointment =
                apr.findById(id)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Appointment not found."
                                )
                        );

        MedicalProfessional doctor =
                getLoggedInDoctor();

        if (appointment.getProfessional() == null ||
                !appointment
                        .getProfessional()
                        .getId()
                        .equals(
                                doctor.getId()
                        )) {

            throw new AccessDeniedException(
                    "You are not authorized to modify this appointment."
            );
        }

        return appointment;
    }

    public String delete(
            Long id) {

        if (!isAdmin()) {

            throw new AccessDeniedException(
                    "Only admin can delete appointments."
            );
        }

        Appointment appointment =
                apr.findById(id)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Appointment not found."
                                )
                        );

        apr.delete(
                appointment
        );

        return "Appointment deleted successfully.";
    }

    private AppointmentDTO.Response convertToResponse(
            Appointment appointment) {

        AppointmentDTO.Response response =
                new AppointmentDTO.Response();

        response.setId(
                appointment.getId()
        );

        response.setAppointmentDate(
                appointment.getAppointmentDate()
        );

        response.setStatus(
                appointment.getStatus()
        );

        response.setReason(
                appointment.getConsultationReason()
        );

        if (appointment.getPatient() != null) {

            response.setPatientName(
                    appointment
                            .getPatient()
                            .getFirstName()
                            + " "
                            + appointment
                                    .getPatient()
                                    .getLastName()
            );
        }

        if (appointment.getProfessional() != null) {

            response.setDoctorName(
                    appointment
                            .getProfessional()
                            .getName()
            );
        }

        return response;
    }
}