package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "tbl_appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String appointmentDate;

    private String appointmentTime;

    private String status;

    private String consultationReason;

    // ==========================================================
    // PATIENT
    // ==========================================================

    @ManyToOne
    @JoinColumn(name = "patientId")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Patient patient;

    // ==========================================================
    // DOCTOR
    // ==========================================================

    @ManyToOne
    @JoinColumn(name = "professionalId")
    private MedicalProfessional professional;

    public Appointment() {

        // Every new appointment starts as PENDING

        this.status = "PENDING";
    }

    public Appointment(
            Long id,
            String appointmentDate,
            String appointmentTime,
            String status,
            String consultationReason,
            Patient patient,
            MedicalProfessional professional) {

        this.id = id;

        this.appointmentDate =
                appointmentDate;

        this.appointmentTime =
                appointmentTime;

        this.status =
                status;

        this.consultationReason =
                consultationReason;

        this.patient =
                patient;

        this.professional =
                professional;
    }

    // ==========================================================
    // GETTERS / SETTERS
    // ==========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(
            String appointmentDate) {

        this.appointmentDate =
                appointmentDate;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(
            String appointmentTime) {

        this.appointmentTime =
                appointmentTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getConsultationReason() {
        return consultationReason;
    }

    public void setConsultationReason(
            String consultationReason) {

        this.consultationReason =
                consultationReason;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public MedicalProfessional getProfessional() {
        return professional;
    }

    public void setProfessional(
            MedicalProfessional professional) {

        this.professional =
                professional;
    }
}
