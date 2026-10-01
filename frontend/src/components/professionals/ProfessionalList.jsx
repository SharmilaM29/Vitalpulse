import React, {
  useCallback,
  useEffect,
  useState
} from 'react'

import {
  fetchProfessionalsList,
  deleteProfessional
} from '../../services/professionalService'

import ProfessionalForm from './ProfessionalForm'
import { useToast } from '../../context/ToastContext'

function ProfessionalList() {
  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading] = useState(true)

  const [showForm, setShowForm] = useState(false)
  const [editingProfessional, setEditingProfessional] = useState(null)

  const { showToast } = useToast()

  // --------------------------------------------------
  // Fetch professionals
  // --------------------------------------------------

  const loadProfessionals = useCallback(async () => {
    try {
      setLoading(true)

      const response = await fetchProfessionalsList()

      setProfessionals(response.data || [])
    } catch (error) {
      console.error(
        'Failed to fetch professionals:',
        error
      )

      showToast(
        error.response?.data?.message ||
          'Failed to load medical professionals.',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadProfessionals()
  }, [loadProfessionals])

  // --------------------------------------------------
  // Register professional
  // --------------------------------------------------

  const handleRegister = () => {
    setEditingProfessional(null)
    setShowForm(true)
  }

  // --------------------------------------------------
  // Edit professional
  // --------------------------------------------------

  const handleEdit = (professional) => {
    setEditingProfessional(professional)
    setShowForm(true)
  }

  // --------------------------------------------------
  // Form success
  // --------------------------------------------------

  const handleFormSuccess = async (message) => {
    setShowForm(false)
    setEditingProfessional(null)

    await loadProfessionals()

    showToast(
      message ||
        'Medical professional saved successfully.',
      'success'
    )
  }

  // --------------------------------------------------
  // Cancel form
  // --------------------------------------------------

  const handleCancel = () => {
    setShowForm(false)
    setEditingProfessional(null)
  }

  // --------------------------------------------------
  // Delete professional
  // --------------------------------------------------

  const handleDelete = async (professional) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${professional.name}?`
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteProfessional(professional.id)

      await loadProfessionals()

      showToast(
        'Medical professional deleted successfully.',
        'success'
      )
    } catch (error) {
      console.error(
        'Delete professional error:',
        error
      )

      showToast(
        error.response?.data?.message ||
          'Failed to delete medical professional.',
        'error'
      )
    }
  }

  // --------------------------------------------------
  // Loading state
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="professional-list">

        <div className="list-header">
          <div>
            <h1>Medical Staff Registry</h1>
          </div>
        </div>

        <div className="loading-message">
          Loading medical professionals...
        </div>

      </div>
    )
  }

  // --------------------------------------------------
  // Main UI
  // --------------------------------------------------

  return (
    <div className="professional-list">

      {/* Header */}
      <div className="list-header">

        <div>
          <h1>Medical Staff Registry</h1>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={handleRegister}
        >
          + Register Staff
        </button>

      </div>

      {/* Register / Edit Form */}
      {showForm && (
        <ProfessionalForm
          professional={editingProfessional}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      )}

      {/* Professional Table */}
      <div className="professional-table-wrapper">

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Employee ID</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {professionals.length === 0 ? (

              <tr>
                <td
                  colSpan="4"
                  className="empty-message"
                >
                  No medical professionals found.
                </td>
              </tr>

            ) : (

              professionals.map((professional) => (

                <tr
                  key={professional.id}
                >

                  <td>
                    {professional.name}
                  </td>

                  <td>
                    {professional.specialization}
                  </td>

                  <td>
                    {professional.employeeId}
                  </td>

                  <td>
                    <div className="professional-actions">

                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(professional)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(professional)
                        }
                      >
                        Delete
                      </button>

                    </div>
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default ProfessionalList
