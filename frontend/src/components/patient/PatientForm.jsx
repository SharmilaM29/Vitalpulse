import React, { useEffect, useState } from 'react'

import {
  enrollPatient,
  updatePatient
} from '../../services/patientService'

import { fetchProfessionalsList } from '../../services/professionalService'

import { useToast } from '../../context/ToastContext'

const initialFormState = {
  firstName: '',
  lastName: '',
  medicalRecordNumber: '',
  dateOfBirth: '',
  gender: '',
  email: '',
  phone: '',
  status: 'Outpatient',
  doctorId: ''
}

function PatientForm({
  patient = null,
  isEditMode = false,
  onSuccess,
  onCancel
}) {
  const [formData, setFormData] = useState(initialFormState)
  const [professionals, setProfessionals] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [doctorsLoading, setDoctorsLoading] = useState(true)

  const { showToast } = useToast()

  // =========================================================
  // FETCH DOCTORS
  // =========================================================

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setDoctorsLoading(true)
        setError('')

        const response = await fetchProfessionalsList()

        setProfessionals(
          Array.isArray(response.data)
            ? response.data
            : []
        )
      } catch (err) {
        console.error(
          'Unable to load doctors:',
          err.response?.data || err
        )

        setProfessionals([])

        const message =
          err.response?.data?.message ||
          err.response?.data ||
          'Unable to load registered doctors.'

        setError(message)
        showToast(message, 'error')
      } finally {
        setDoctorsLoading(false)
      }
    }

    loadDoctors()
  }, [showToast])

  // =========================================================
  // LOAD PATIENT WHEN EDITING
  // =========================================================

  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
        medicalRecordNumber:
          patient.medicalRecordNumber || '',
        dateOfBirth:
          patient.dateOfBirth || '',
        gender:
          patient.gender || '',
        email:
          patient.email || '',
        phone:
          patient.phone || '',
        status:
          patient.status || 'Outpatient',
        doctorId:
          patient.doctorid ||
          patient.doctorId ||
          ''
      })
    } else {
      setFormData(initialFormState)
    }

    setError('')
  }, [patient])

  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const data = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        medicalRecordNumber:
          formData.medicalRecordNumber.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        status: formData.status,
        doctorid: formData.doctorId
          ? Number(formData.doctorId)
          : null
      }

      console.log(
        'PATIENT DATA SENT:',
        data
      )

      let result

      if (isEditMode && patient?.id) {
        result = await updatePatient(
          patient.id,
          data
        )

        showToast(
          'Patient updated successfully.',
          'success'
        )
      } else {
        result = await enrollPatient(data)

        showToast(
          'Patient enrolled successfully.',
          'success'
        )
      }

      setFormData(initialFormState)

      if (onSuccess) {
        onSuccess(result.data)
      }
    } catch (err) {
      console.error(
        'PATIENT SAVE ERROR:',
        err.response?.data || err
      )

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        'Unable to save patient.'

      setError(backendMessage)

      showToast(
        backendMessage,
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="patient-form"
    >
      <h2>
        {isEditMode
          ? 'Edit Patient'
          : 'Enroll Patient'}
      </h2>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {/* First Name */}
      <div className="form-group">
        <label htmlFor="patient-first-name">
          First Name
        </label>

        <input
          id="patient-first-name"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>

      {/* Last Name */}
      <div className="form-group">
        <label htmlFor="patient-last-name">
          Last Name
        </label>

        <input
          id="patient-last-name"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      {/* MRN */}
      <div className="form-group">
        <label htmlFor="patient-mrn">
          Medical Record Number
        </label>

        <input
          id="patient-mrn"
          name="medicalRecordNumber"
          type="text"
          value={formData.medicalRecordNumber}
          onChange={handleChange}
          placeholder="MRN-XXXX-XXXX"
          disabled={isEditMode}
          required
        />
      </div>

      {/* Date of Birth */}
      <div className="form-group">
        <label htmlFor="patient-date-of-birth">
          Date of Birth
        </label>

        <input
          id="patient-date-of-birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />
      </div>

      {/* Gender */}
      <div className="form-group">
        <label htmlFor="patient-gender">
          Gender
        </label>

        <select
          id="patient-gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">
            Select Gender
          </option>

          <option value="Male">
            Male
          </option>

          <option value="Female">
            Female
          </option>

          <option value="Other">
            Other
          </option>
        </select>
      </div>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="patient-email">
          Email ID
        </label>

        <input
          id="patient-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="patient@example.com"
        />
      </div>

      {/* Phone */}
      <div className="form-group">
        <label htmlFor="patient-phone">
          Phone Number
        </label>

        <input
          id="patient-phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
        />
      </div>

      {/* Patient Status */}
      <div className="form-group">
        <label htmlFor="patient-status">
          Patient Status
        </label>

        <select
          id="patient-status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="Outpatient">
            Outpatient
          </option>

          <option value="Admitted">
            Admitted
          </option>

          <option value="Discharged">
            Discharged
          </option>
        </select>
      </div>

      {/* Doctor */}
      <div className="form-group">
        <label htmlFor="patient-doctor">
          Doctor
        </label>

        <select
          id="patient-doctor"
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          disabled={doctorsLoading}
          required
        >
          <option value="">
            {doctorsLoading
              ? 'Loading doctors...'
              : 'Select Doctor'}
          </option>

          {!doctorsLoading &&
            professionals.map((professional) => (
              <option
                key={professional.id}
                value={professional.id}
              >
                {professional.name}
                {professional.specialization
                  ? ` - ${professional.specialization}`
                  : ''}
              </option>
            ))}
        </select>
      </div>

      {/* Buttons */}
      <div
        className="form-actions"
        style={{
          display: 'flex',
          gap: '10px'
        }}
      >
        <button
          type="submit"
          className="primary-btn"
          disabled={loading || doctorsLoading}
        >
          {loading
            ? 'Saving...'
            : isEditMode
              ? 'Update Patient'
              : 'Enroll Patient'}
        </button>

        {onCancel && (
          <button
            type="button"
            className="secondary-btn"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default PatientForm
