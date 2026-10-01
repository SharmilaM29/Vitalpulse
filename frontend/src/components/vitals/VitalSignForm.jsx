import React, { useState } from 'react'
import { logVital } from '../../services/vitalSignService'

const initialFormState = {
  patientId: '',
  bloodPressure: '',
  heartRate: '',
  bodyTemperature: '',
  oxygenLevel: '',
  recordedAt: ''
}

const encodeBloodPressure = (bp) => {

  const [
    systolic,
    diastolic
  ] = bp
    .split('/')
    .map((n) => n.trim())

  if (!systolic || !diastolic) {
    return NaN
  }

  return parseFloat(
    `${systolic}.${diastolic}`
  )
}

function VitalSignForm({
  onSuccess,
  onCancel,
  patients = []
}) {

  const [
    formData,
    setFormData
  ] = useState(initialFormState)

  const [error, setError] =
    useState('')

  const [
    loading,
    setLoading
  ] = useState(false)

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    setError('')
    setLoading(true)

    const encodedBP =
      encodeBloodPressure(
        formData.bloodPressure
      )

    if (Number.isNaN(encodedBP)) {

      setError(
        'Blood pressure must be in the format systolic/diastolic, e.g. 120/80.'
      )

      setLoading(false)

      return
    }

    try {

      await logVital({

        patientId:
          Number(formData.patientId),

        bloodPressure:
          encodedBP,

        heartRate:
          Number(formData.heartRate),

        bodyTemperature:
          Number(formData.bodyTemperature),

        oxygenLevel:
          Number(formData.oxygenLevel),

        recordedAt:
          formData.recordedAt
      })

      setFormData(
        initialFormState
      )

      if (onSuccess) {
        onSuccess()
      }

    } catch (err) {

      console.error(
        'Failed to record vital:',
        err
      )

      setError(
        err.response?.data ||
        'Failed to record vital signs.'
      )

    } finally {

      setLoading(false)

    }
  }

  return (

    <form
      className="vital-sign-form"
      onSubmit={handleSubmit}
    >

      {error && (
        <p className="status-message">
          {error}
        </p>
      )}

      <div className="form-group">

        <label htmlFor="vital-patient-id">
          Patient
        </label>

        <select
          id="vital-patient-id"
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
              {' '}
              ({p.medicalRecordNumber})
            </option>

          ))}

        </select>

      </div>

      <div className="form-group">

        <label htmlFor="vital-blood-pressure">
          Blood Pressure
        </label>

        <input
          id="vital-blood-pressure"
          name="bloodPressure"
          type="text"
          placeholder="e.g. 120/80"
          value={formData.bloodPressure}
          onChange={handleChange}
          required
        />

      </div>

      <div className="form-group">

        <label htmlFor="vital-heart-rate">
          Heart Rate
        </label>

        <input
          id="vital-heart-rate"
          name="heartRate"
          type="number"
          placeholder="e.g. 72"
          value={formData.heartRate}
          onChange={handleChange}
          required
        />

      </div>

      <div className="form-group">

        <label htmlFor="vital-body-temperature">
          Body Temperature
        </label>

        <input
          id="vital-body-temperature"
          name="bodyTemperature"
          type="number"
          step="0.1"
          placeholder="e.g. 98.6"
          value={formData.bodyTemperature}
          onChange={handleChange}
          required
        />

      </div>

      <div className="form-group">

        <label htmlFor="vital-oxygen-level">
          Oxygen Level
        </label>

        <input
          id="vital-oxygen-level"
          name="oxygenLevel"
          type="number"
          placeholder="e.g. 97"
          min="0"
          max="100"
          value={formData.oxygenLevel}
          onChange={handleChange}
          required
        />

      </div>

      <div className="form-group">

        <label htmlFor="vital-recorded-at">
          Recorded At
        </label>

        <input
          id="vital-recorded-at"
          name="recordedAt"
          type="datetime-local"
          value={formData.recordedAt}
          onChange={handleChange}
          required
        />

      </div>

      <button
        type="submit"
        className="primary-btn"
        disabled={loading}
      >

        {loading
          ? 'Recording...'
          : 'Log Vitals'}

      </button>

      {onCancel && (

        <button
          type="button"
          className="link-btn"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>

      )}

    </form>
  )
}

export default VitalSignForm
