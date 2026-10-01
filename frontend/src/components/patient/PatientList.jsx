import React, {
  useEffect,
  useState
} from 'react'

import {
  useDispatch,
  useSelector
} from 'react-redux'

import {
  fetchPatients,
  removePatient
} from '../../store/slices/patientSlice'

import PatientForm from './PatientForm'

import {
  useToast
} from '../../context/ToastContext'

function PatientList() {

  const dispatch = useDispatch()

  const {
    showToast
  } = useToast()

  const [statusMessage, setStatusMessage] = useState('')

  // ==================================================
  // PATIENT DATA
  // ==================================================

  const {
    items: patients = [],
    loading,
    error
  } = useSelector(
    (state) =>
      state.patients || {}
  )

  // ==================================================
  // USER ROLE
  // ==================================================

  const role = useSelector(
    (state) =>
      state.auth?.role
  )

  const normalizedRole =
    (role || '')
      .toUpperCase()
      .replace('ROLE_', '')

  const isDoctor =
    normalizedRole === 'DOCTOR'

  // ==================================================
  // LOCAL STATE
  // ==================================================

  const [
    showForm,
    setShowForm
  ] = useState(false)

  const [
    editingPatient,
    setEditingPatient
  ] = useState(null)

  // ==================================================
  // FETCH PATIENTS
  // ==================================================

  useEffect(() => {

    console.log(
      'PatientList mounted'
    )

    console.log(
      'Current role:',
      normalizedRole
    )

    dispatch(
      fetchPatients()
    )

  }, [
    dispatch,
    normalizedRole
  ])

  // ==================================================
  // DEBUG PATIENT DATA
  // ==================================================

  useEffect(() => {

    console.log(
      'Patients received by PatientList:',
      patients
    )

  }, [patients])

  // ==================================================
  // SHOW FETCH ERROR
  // ==================================================

  useEffect(() => {

    if (!error) {
      return
    }

    const errorMessage =
      typeof error === 'string'
        ? error
        : error?.message ||
          'Failed to load patients.'

    showToast(
      errorMessage,
      'error'
    )

  }, [
    error,
    showToast
  ])

  // ==================================================
  // ADD PATIENT
  // ==================================================

  const handleAddPatient = () => {

    setEditingPatient(null)

    setShowForm(true)

  }

  // ==================================================
  // EDIT PATIENT
  // ==================================================

  const handleEdit = (
    patient
  ) => {

    setEditingPatient(
      patient
    )

    setShowForm(true)

  }

  // ==================================================
  // DELETE PATIENT
  // ==================================================

  const handleDelete = async (id) => {

    try {

      const result =
        await dispatch(
          removePatient(id)
        )

      // Check whether the delete thunk failed
      if (
        removePatient.rejected.match(
          result
        )
      ) {

        const errorMessage =
          result.payload ||
          result.error?.message ||
          'Failed to delete patient.'

        showToast(
          typeof errorMessage === 'string'
            ? errorMessage
            : 'Failed to delete patient.',
          'error'
        )

        return
      }

      // Refresh patient list
      // after successful deletion
      await dispatch(
        fetchPatients()
      )

      // Display persistent success message
      // so the UI and test can see it
      setStatusMessage(
        'Patient deleted successfully.'
      )

      showToast(
        'Patient deleted successfully.',
        'success'
      )

    } catch (error) {

      console.error(
        'Delete patient error:',
        error
      )

      showToast(
        'Failed to delete patient.',
        'error'
      )

    }

  }

  // ==================================================
  // FORM SUCCESS
  // ==================================================

  const handleFormSuccess =
    async () => {

      const wasEditing =
        Boolean(
          editingPatient
        )

      setShowForm(false)

      setEditingPatient(null)

      await dispatch(
        fetchPatients()
      )

      showToast(
        wasEditing
          ? 'Patient updated successfully.'
          : 'Patient enrolled successfully.',
        'success'
      )

    }

  // ==================================================
  // CANCEL
  // ==================================================

  const handleCancel = () => {

    setShowForm(false)

    setEditingPatient(null)

  }

  // ==================================================
  // PATIENT STATUS
  // ==================================================

  const getStatusClass = (
    status
  ) => {

    const normalizedStatus =
      (status || '')
        .toLowerCase()

    if (
      normalizedStatus ===
      'admitted'
    ) {

      return 'admitted'

    }

    if (
      normalizedStatus ===
      'outpatient'
    ) {

      return 'outpatient'

    }

    if (
      normalizedStatus ===
      'discharged'
    ) {

      return 'discharged'

    }

    return 'unknown'

  }

  // ==================================================
  // PATIENT FORM
  // ==================================================

  if (
    showForm &&
    !isDoctor
  ) {

    return (

      <div className="patient-list">

        <PatientForm

          patient={
            editingPatient
          }

          isEditMode={
            Boolean(
              editingPatient
            )
          }

          onSuccess={
            handleFormSuccess
          }

          onCancel={
            handleCancel
          }

        />

      </div>

    )

  }

  // ==================================================
  // MAIN UI
  // ==================================================

  return (

    <div className="patient-list">

      {/* ==============================================
          HEADER
      ============================================== */}

      <div className="list-header">

        <div>

          <h1>
            System Patients
          </h1>

          <p>
            Electronic health records management.
          </p>

        </div>

        {!isDoctor && (

          <button
            type="button"
            className="primary-btn"
            onClick={
              handleAddPatient
            }
          >
            + Enroll
          </button>

        )}

      </div>

      {/* ==============================================
          LOADING
      ============================================== */}

      {loading &&
      patients.length === 0 ? (

        <p>
          Loading patients...
        </p>

      ) : error ? (

        <p>
          Unable to load patients.
        </p>

      ) : patients.length === 0 ? (

        <p>
          No patients found in system
        </p>

      ) : (

        <table>

          <thead>

            <tr>

              <th>
                Name
              </th>

              <th>
                MRN
              </th>

              <th>
                DOB
              </th>

              <th>
                Status
              </th>

              <th>
                Doctor
              </th>

              {!isDoctor && (

                <th>
                  Actions
                </th>

              )}

            </tr>

          </thead>

          <tbody>

            {patients.map(
              (patient) => (

                <tr
                  key={
                    patient.id
                  }
                >

                  <td>

                    {patient.firstName}{' '}

                    {patient.lastName}

                  </td>

                  <td>

                    {
                      patient.medicalRecordNumber
                    }

                  </td>

                  <td>

                    {
                      patient.dateOfBirth
                    }

                  </td>

                  <td>

                    <span
                      className={
                        `patient-status ${
                          getStatusClass(
                            patient.status
                          )
                        }`
                      }
                    >

                      {
                        patient.status ||
                        'Not Set'
                      }

                    </span>

                  </td>

                  <td>

                    {
                      patient.doctorName ||
                      patient.assignedDoctor?.fullName ||
                      patient.assignedDoctor?.name ||
                      'Not assigned'
                    }

                  </td>

                  {!isDoctor && (

                    <td>

                      <button
                        type="button"
                        aria-label={
                          `Edit ${patient.firstName} ${patient.lastName}`
                        }
                        onClick={() =>
                          handleEdit(
                            patient
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        aria-label={
                          `Delete ${patient.firstName} ${patient.lastName}`
                        }
                        onClick={() =>
                          handleDelete(
                            patient.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  )}

                </tr>

              )
            )}

          </tbody>

        </table>

      )}

      {/* ==============================================
          DELETE SUCCESS MESSAGE
      ============================================== */}

      {statusMessage && (

        <p className="status-message">
          {statusMessage}
        </p>

      )}

    </div>

  )

}

export default PatientList
