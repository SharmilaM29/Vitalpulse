import React, { useEffect, useState } from 'react'

import {
  registerProfessional,
  updateProfessional
} from '../../services/professionalService'

import { useToast } from '../../context/ToastContext'

const initialFormState = {
  name: '',
  specialization: '',
  employeeId: '',
  username: '',
  password: ''
}

function ProfessionalForm({
  onSuccess,
  onCancel,
  professional = null
}) {
  const { showToast } = useToast()

  const [formData, setFormData] = useState(initialFormState)
  const [loading, setLoading] = useState(false)

  const isEditMode = Boolean(professional)

  useEffect(() => {
    if (professional) {
      setFormData({
        name: professional.name || '',
        specialization: professional.specialization || '',
        employeeId: professional.employeeId || '',
        username: professional.username || '',
        password: ''
      })
    } else {
      setFormData(initialFormState)
    }
  }, [professional])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    try {
      const data = {
        name: formData.name,
        specialization: formData.specialization,
        employeeId: Number(formData.employeeId),
        username: formData.username
      }

      if (
        !isEditMode ||
        formData.password.trim() !== ''
      ) {
        data.password = formData.password
      }

      if (isEditMode) {
        await updateProfessional(
          professional.id,
          data
        )
      } else {
        await registerProfessional(data)
      }

      setFormData(initialFormState)

      if (onSuccess) {
        onSuccess(
          isEditMode
            ? 'Professional updated successfully.'
            : 'Professional registered successfully.'
        )
      }

    } catch (err) {
      console.error(
        'Professional save error:',
        err
      )

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        (
          isEditMode
            ? 'Unable to update staff member.'
            : 'Unable to register staff member.'
        )

      showToast(
        typeof message === 'string'
          ? message
          : isEditMode
            ? 'Unable to update staff member.'
            : 'Unable to register staff member.',
        'error'
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="professional-form"
    >

      <h2>
        {isEditMode
          ? 'Edit Medical Staff'
          : 'Register Staff'}
      </h2>

      <div className="form-group">
        <label htmlFor="professional-name">
          Name
        </label>

        <input
          id="professional-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="professional-specialization">
          Specialization
        </label>

        <input
          id="professional-specialization"
          name="specialization"
          type="text"
          placeholder="e.g. Cardiology"
          value={formData.specialization}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="professional-employee-id">
          Employee ID
        </label>

        <input
          id="professional-employee-id"
          name="employeeId"
          type="number"
          placeholder="e.g. 3"
          value={formData.employeeId}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="professional-username">
          Doctor Username
        </label>

        <input
          id="professional-username"
          name="username"
          type="text"
          placeholder="e.g. doctor123"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="professional-password">
          Doctor Password
        </label>

        <input
          id="professional-password"
          name="password"
          type="password"
          placeholder={
            isEditMode
              ? 'Leave blank to keep current password'
              : 'Enter login password'
          }
          value={formData.password}
          onChange={handleChange}
          required={!isEditMode}
        />

        {isEditMode && (
          <small className="password-help">
            Leave blank if you do not want to change the password.
          </small>
        )}
      </div>

      <div className="form-actions">

        <button
          type="submit"
          className="primary-btn"
          disabled={loading}
        >
          {loading
            ? 'Saving...'
            : isEditMode
              ? 'Update Staff'
              : 'Register Staff'}
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

export default ProfessionalForm
