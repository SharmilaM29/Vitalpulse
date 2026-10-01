package com.example.demo.dto;

public class AppointmentDTO {

    // ==========================================================
    // REQUEST
    // ==========================================================

    public static class Request {

        private String appointmentDate;
        private Long patientId;
        private Long professionalId;
        private String reason;

        public Request() {
        }

        public Request(
                String appointmentDate,
                Long patientId,
                Long professionalId,
                String reason) {

            this.appointmentDate =
                    appointmentDate;

            this.patientId =
                    patientId;

            this.professionalId =
                    professionalId;

            this.reason =
                    reason;
        }

        public String getAppointmentDate() {
            return appointmentDate;
        }

        public void setAppointmentDate(
                String appointmentDate) {

            this.appointmentDate =
                    appointmentDate;
        }

        public Long getPatientId() {
            return patientId;
        }

        public void setPatientId(Long patientId) {
            this.patientId =
                    patientId;
        }

        public Long getProfessionalId() {
            return professionalId;
        }

        public void setProfessionalId(
                Long professionalId) {

            this.professionalId =
                    professionalId;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason =
                    reason;
        }
    }

    // ==========================================================
    // RESPONSE
    // ==========================================================

    public static class Response {

        private Long id;

        private String appointmentDate;

        private String status;

        private String patientName;

        private String doctorName;

        private String reason;

        public Response() {
        }

        public Response(
                Long id,
                String appointmentDate,
                String status,
                String patientName,
                String doctorName,
                String reason) {

            this.id = id;

            this.appointmentDate =
                    appointmentDate;

            this.status =
                    status;

            this.patientName =
                    patientName;

            this.doctorName =
                    doctorName;

            this.reason =
                    reason;
        }

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

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status =
                    status;
        }

        public String getPatientName() {
            return patientName;
        }

        public void setPatientName(
                String patientName) {

            this.patientName =
                    patientName;
        }

        public String getDoctorName() {
            return doctorName;
        }

        public void setDoctorName(
                String doctorName) {

            this.doctorName =
                    doctorName;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason =
                    reason;
        }
    }
}
