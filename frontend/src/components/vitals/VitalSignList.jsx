import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVitals, removeVitals } from '../../store/slices/vitalSignSlice'
import { fetchPatients } from '../../store/slices/patientSlice'
import VitalSignForm from './VitalSignForm'
import { useToast } from '../../context/ToastContext'

function VitalSignList() {
  const dispatch = useDispatch()
  const { showToast } = useToast()

  const { items: vitals = [], loading, error } = useSelector(
    (state) => state.vitals || {}
  )
  const { items: patients = [] } = useSelector(
    (state) => state.patients || {}
  )

  const role = useSelector((state) => state.auth?.role)
  const normalizedRole = (role || '').toUpperCase().replace('ROLE_', '')
  const canManageVitals =
    normalizedRole === 'DOCTOR' || role === null || role === undefined

  const [showForm, setShowForm] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    dispatch(fetchVitals())

    if (canManageVitals) {
      dispatch(fetchPatients())
    }
  }, [dispatch, canManageVitals])

  useEffect(() => {
    if (!error) return

    const message =
      typeof error === 'string'
        ? error
        : error?.message || 'Failed to load vital signs.'

    showToast(message, 'error')
  }, [error, showToast])

  const handleVitalSuccess = async () => {
    setShowForm(false)
    await dispatch(fetchVitals())
    showToast('Vital signs recorded successfully.', 'success')
  }

  const handleCancel = () => {
    setShowForm(false)
  }

  const handlePurge = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this vital record?'
    )

    if (!confirmed) return

    try {
      const result = await dispatch(removeVitals(id))

      if (result?.meta?.requestStatus === 'rejected') {
        throw (
          result.payload ||
          result.error ||
          new Error('Failed to delete vital record.')
        )
      }

      await dispatch(fetchVitals())
      setStatusMessage('Vital record deleted successfully.')
      showToast('Vital record deleted successfully.', 'success')
    } catch (err) {
      const errorMessage =
        err?.message ||
        err?.payload?.message ||
        err?.payload ||
        'Failed to delete vital record.'

      showToast(
        typeof errorMessage === 'string'
          ? errorMessage
          : 'Failed to delete vital record.',
        'error'
      )
    }
  }

  if (showForm && canManageVitals) {
    return (
      <div className="vital-list">
        <VitalSignForm
          patients={patients}
          onSuccess={handleVitalSuccess}
          onCancel={handleCancel}
        />
      </div>
    )
  }

  return (
    <div className="vital-list">
      <div className="list-header">
        <div>
          <h1>Biometric Monitoring</h1>
          <p>Monitor and manage patient vital signs.</p>
        </div>

        {canManageVitals && (
          <button
            type="button"
            className="primary-btn"
            onClick={() => setShowForm(true)}
          >
            + Add Vital
          </button>
        )}
      </div>

      {statusMessage && (
        <p className="status-message">{statusMessage}</p>
      )}

      {loading && vitals.length === 0 ? (
        <p>Loading vital signs...</p>
      ) : error ? (
        <p>Unable to load vital signs.</p>
      ) : vitals.length === 0 ? (
        <p>No vital records found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Heart Rate</th>
              <th>Blood Pressure</th>
              <th>Temperature</th>
              <th>Oxygen</th>
              <th>Recorded At</th>
              {canManageVitals && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
  {vitals.map((vital) => (
    <tr key={vital.id}>
      <td>
        {vital.patient || 'Patient'}
      </td>

      <td>
        {vital.heartRate ?? '--'} bpm
      </td>

      <td>
        {vital.bloodPressure ?? '--'} mmHg
      </td>

      <td>
        {vital.bodyTemperature ?? '--'} °C
      </td>

      <td>
        {vital.oxygenLevel ?? '--'}%
      </td>

      <td>
        {vital.recordedAt || 'Not available'}
      </td>

      {canManageVitals && (
        <td>
          <button
            type="button"
            className="danger-btn"
            onClick={() => handlePurge(vital.id)}
          >
            Purge
          </button>
        </td>
      )}
    </tr>
  ))}
</tbody>
        </table>
      )}
    </div>
  )
}

export default VitalSignList
