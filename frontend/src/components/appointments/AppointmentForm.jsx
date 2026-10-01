import React, { useState } from 'react'
import { createAppointment } from '../../services/appointmentService'

const initialFormState = {
  patientId: '',
  professionalId: '',
  dateTime: '',
  reason: ''
}

function AppointmentForm({
  onSuccess,
  onCancel,
  patients = [],
  professionals = []
}) {
  const [formData, setFormData] =
    useState(initialFormState)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  /*
   * Handle form field changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  /*
   * Submit appointment
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const data = {
        patientId: Number(formData.patientId),
        professionalId: Number(
          formData.professionalId
        ),
        appointmentDate: formData.dateTime,
        reason: formData.reason
      }

      const result = await createAppointment(data)

      setFormData(initialFormState)

      if (onSuccess) {
        onSuccess(result.data)
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to schedule appointment.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="appointment-form"
      onSubmit={handleSubmit}
    >

      {/* Error */}
      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {/* Patient */}
      <div className="form-group">

        <label htmlFor="patientId">
          Patient Name
        </label>

        <select
          id="patientId"
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          required
        >

          <option value="">
            Select a patient
          </option>

          {patients.map((p) => (
            <option
              key={p.id}
              value={p.id}
            >
              {p.firstName} {p.lastName}
            </option>
          ))}

        </select>

      </div>

      {/* Professional */}
      <div className="form-group">

        <label htmlFor="professionalId">
          Professional Name
        </label>

        <select
          id="professionalId"
          name="professionalId"
          value={formData.professionalId}
          onChange={handleChange}
          required
        >

          <option value="">
            Select a professional
          </option>

          {professionals.map((p) => (
            <option
              key={p.id}
              value={p.id}
            >
              {p.name}
            </option>
          ))}

        </select>

      </div>

      {/* Date and Time */}
      <div className="form-group">

        <label htmlFor="dateTime">
          Time &amp; Date
        </label>

        <input
          id="dateTime"
          name="dateTime"
          type="datetime-local"
          value={formData.dateTime}
          onChange={handleChange}
          required
        />

      </div>

      {/* Reason */}
      <div className="form-group">

        <label htmlFor="reason">
          Reason
        </label>

        <textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
        />

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
          disabled={loading}
        >
          {loading
            ? 'Scheduling...'
            : 'Confirm Schedule'}
        </button>

        {onCancel && (
          <button
            type="button"
            className="secondary-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}

      </div>

    </form>
  )
}

export default AppointmentForm
