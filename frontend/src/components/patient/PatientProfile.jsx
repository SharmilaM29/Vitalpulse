import React, { useEffect, useState } from 'react'
import { getMyProfile } from '../../services/patientService'

function PatientProfile() {

  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const loadProfile = async () => {

      try {

        setLoading(true)

        const response = await getMyProfile()

        setPatient(response.data)
        setError('')

      } catch (err) {

        setError(
          err.response?.data ||
          'Unable to load patient profile.'
        )

      } finally {

        setLoading(false)

      }

    }

    loadProfile()

  }, [])

  if (loading) {
    return (
      <div className="profile-page">
        <h1>Patient Profile</h1>
        <p>Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-page">
        <h1>Patient Profile</h1>

        <div className="error-message">
          {typeof error === 'string'
            ? error
            : 'Unable to load patient profile.'}
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="profile-page">
        <h1>Patient Profile</h1>
        <p>Patient profile not found.</p>
      </div>
    )
  }

  return (
    <div className="profile-page">

      <div className="profile-header">

        <div className="large-profile-avatar">
          👤
        </div>

        <div>

          <h1>
            {patient.firstName} {patient.lastName}
          </h1>

          <p>
            Patient
          </p>

        </div>

      </div>

      <div className="profile-card">

        <h2>Personal Information</h2>

        <div className="profile-grid">

          <div className="profile-field">
            <span>First Name</span>

            <strong>
              {patient.firstName || '-'}
            </strong>
          </div>

          <div className="profile-field">
            <span>Last Name</span>

            <strong>
              {patient.lastName || '-'}
            </strong>
          </div>

          <div className="profile-field">
            <span>Medical Record Number</span>

            <strong>
              {patient.medicalRecordNumber || '-'}
            </strong>
          </div>

          <div className="profile-field">
            <span>Date of Birth</span>

            <strong>
              {patient.dateOfBirth || '-'}
            </strong>
          </div>

          <div className="profile-field">
            <span>Gender</span>

            <strong>
              {patient.gender || '-'}
            </strong>
          </div>

          <div className="profile-field">
            <span>Email</span>

            <strong>
              {patient.email || '-'}
            </strong>
          </div>

          <div className="profile-field">
            <span>Phone</span>

            <strong>
              {patient.phone || '-'}
            </strong>
          </div>

          <div className="profile-field">
            <span>Status</span>

            <strong className="patient-status">
              {patient.status || '-'}
            </strong>
          </div>

          <div className="profile-field">
            <span>Assigned Doctor</span>

            <strong>
              {patient.doctorName || 'Not assigned'}
            </strong>
          </div>

          <div className="profile-field">
            <span>Specialization</span>

            <strong>
              {patient.doctorSpecialization || '-'}
            </strong>
          </div>

        </div>

      </div>

    </div>
  )
}

export default PatientProfile