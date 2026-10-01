package com.example.demo.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tbl_professionals")
public class MedicalProfessional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String specialization;

    private Long employeeId;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "assignedDoctor")
    @JsonManagedReference
    private List<Patient> patientassigned;

    public MedicalProfessional() {
    }

    public MedicalProfessional(
            Long id,
            String name,
            String specialization,
            Long employeeId,
            User user,
            List<Patient> patientassigned) {

        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.employeeId = employeeId;
        this.user = user;
        this.patientassigned = patientassigned;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Patient> getPatientassigned() {
        return patientassigned;
    }

    public void setPatientassigned(
            List<Patient> patientassigned) {

        this.patientassigned = patientassigned;
    }
}
