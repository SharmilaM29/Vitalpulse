package com.example.demo.dto;

public class VitalSignDTO {

    public static class Request {
        private double heartRate;
        private double bloodPressure;
        private double bodyTemperature;
        private double oxygenLevel;
        private String recordedAt;
        private Long patientId;

        public Request(){}
        public Request(double heartRate, double bloodPressure, double bodyTemperature, double oxygenLevel,
                String recordedAt, Long patientId) {
            this.heartRate = heartRate;
            this.bloodPressure = bloodPressure;
            this.bodyTemperature = bodyTemperature;
            this.oxygenLevel = oxygenLevel;
            this.recordedAt = recordedAt;
            this.patientId = patientId;
        }
        public double getHeartRate() {
            return heartRate;
        }
        public void setHeartRate(double heartRate) {
            this.heartRate = heartRate;
        }
        public double getBloodPressure() {
            return bloodPressure;
        }
        public void setBloodPressure(double bloodPressure) {
            this.bloodPressure = bloodPressure;
        }
        public double getBodyTemperature() {
            return bodyTemperature;
        }
        public void setBodyTemperature(double bodyTemperature) {
            this.bodyTemperature = bodyTemperature;
        }
        public double getOxygenLevel() {
            return oxygenLevel;
        }
        public void setOxygenLevel(double oxygenLevel) {
            this.oxygenLevel = oxygenLevel;
        }
        public String getRecordedAt() {
            return recordedAt;
        }
        public void setRecordedAt(String recordedAt) {
            this.recordedAt = recordedAt;
        }
        public Long getPatientId() {
            return patientId;
        }
        public void setPatientId(Long patientId) {
            this.patientId = patientId;
        }
    }

    public static class Response {

        private Long Id;
        private double heartRate;
        private double bloodPressure;
        private double bodyTemperature;
        private double oxygenLevel;
        private String recordedAt;
        private String patient;

        public Response(){}

        public Response(Long id, double heartRate, double bloodPressure, double bodyTemperature, double oxygenLevel,
                String recordedAt, String patient) {
            Id = id;
            this.heartRate = heartRate;
            this.bloodPressure = bloodPressure;
            this.bodyTemperature = bodyTemperature;
            this.oxygenLevel = oxygenLevel;
            this.recordedAt = recordedAt;
            this.patient = patient;
        }

        public Long getId() {
            return Id;
        }

        public void setId(Long id) {
            Id = id;
        }

        public double getHeartRate() {
            return heartRate;
        }

        public void setHeartRate(double heartRate) {
            this.heartRate = heartRate;
        }

        public double getBloodPressure() {
            return bloodPressure;
        }

        public void setBloodPressure(double bloodPressure) {
            this.bloodPressure = bloodPressure;
        }

        public double getBodyTemperature() {
            return bodyTemperature;
        }

        public void setBodyTemperature(double bodyTemperature) {
            this.bodyTemperature = bodyTemperature;
        }

        public double getOxygenLevel() {
            return oxygenLevel;
        }

        public void setOxygenLevel(double oxygenLevel) {
            this.oxygenLevel = oxygenLevel;
        }

        public String getRecordedAt() {
            return recordedAt;
        }

        public void setRecordedAt(String recordedAt) {
            this.recordedAt = recordedAt;
        }

        public String getPatient() {
            return patient;
        }

        public void setPatient(String patient) {
            this.patient = patient;
        }
    }
}
