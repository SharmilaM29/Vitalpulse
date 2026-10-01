import React, {
  useEffect,
  useState
} from 'react'

import {
  useDispatch,
  useSelector
} from 'react-redux'

import {
  fetchAppointments,
  approveAppointments,
  cancelAppointments
} from '../../store/slices/appointmentSlice'

import {
  fetchPatients
} from '../../store/slices/patientSlice'

import api from '../../services/api'

import AppointmentForm from './AppointmentForm'

import {
  useToast
} from '../../context/ToastContext'

function AppointmentList() {

  const dispatch = useDispatch()

  const {
    showToast
  } = useToast()

  // ==========================================================
  // AUTH
  // ==========================================================

  const {
    role
  } = useSelector(
    (state) =>
      state.auth || {}
  )

  const isAdmin =
    role === 'ADMIN'

  const isDoctor =
    role === 'DOCTOR' ||
    !role

  // ==========================================================
  // APPOINTMENTS
  // ==========================================================

  const {
    items: appointments = [],
    loading: appointmentLoading,
    error: appointmentError
  } = useSelector(
    (state) =>
      state.appointments || {}
  )

  // ==========================================================
  // PATIENTS
  // ==========================================================

  const {
    items: patients = []
  } = useSelector(
    (state) =>
      state.patients || {}
  )

  // ==========================================================
  // PROFESSIONALS
  // ==========================================================

  const [
    professionals,
    setProfessionals
  ] = useState([])

  const [
    ,
    setProfessionalLoading
  ] = useState(false)

  const [
    professionalError,
    setProfessionalError
  ] = useState('')

  // ==========================================================
  // OTHER STATES
  // ==========================================================

  const [
    showForm,
    setShowForm
  ] = useState(false)

  // Added for T19
  const [
    statusMessage,
    setStatusMessage
  ] = useState('')

  // ==========================================================
  // FETCH APPOINTMENTS
  // ==========================================================

  useEffect(() => {

    dispatch(
      fetchAppointments()
    )

  }, [
    dispatch
  ])

  // ==========================================================
  // ADMIN ONLY:
  // FETCH PATIENTS AND PROFESSIONALS
  // ==========================================================

  useEffect(() => {

    if (!isAdmin) {
      return
    }

    dispatch(
      fetchPatients()
    )

    const loadProfessionals =
      async () => {

        try {

          setProfessionalLoading(
            true
          )

          setProfessionalError(
            ''
          )

          const response =
            await api.get(
              '/professionals/'
            )

          if (
            Array.isArray(
              response.data
            )
          ) {

            setProfessionals(
              response.data
            )

          } else {

            setProfessionals([])

          }

        } catch (error) {

          console.error(
            'Error loading professionals:',
            error.response?.data ||
            error
          )

          setProfessionals([])

          const message =
            error.response?.data?.message ||
            error.response?.data ||
            'Unable to load medical professionals.'

          setProfessionalError(
            typeof message === 'string'
              ? message
              : 'Unable to load medical professionals.'
          )

          showToast(
            typeof message === 'string'
              ? message
              : 'Unable to load medical professionals.',
            'error'
          )

        } finally {

          setProfessionalLoading(
            false
          )

        }

      }

    loadProfessionals()

  }, [
    dispatch,
    isAdmin,
    showToast
  ])

  // ==========================================================
  // APPOINTMENT ERROR
  // ==========================================================

  useEffect(() => {

    if (!appointmentError) {
      return
    }

    const message =
      typeof appointmentError === 'string'
        ? appointmentError
        : appointmentError?.message ||
          'Failed to load appointments.'

    showToast(
      message,
      'error'
    )

  }, [
    appointmentError,
    showToast
  ])

  // ==========================================================
  // NEW APPOINTMENT
  // ==========================================================

  const handleNewAppointment = () => {
    setShowForm(true)
  }

  // ==========================================================
  // APPROVE
  // ==========================================================

  const handleApprove =
    async (id) => {

      const result =
        await dispatch(
          approveAppointments(id)
        )

      if (
        approveAppointments.fulfilled.match(
          result
        )
      ) {

        await dispatch(
          fetchAppointments()
        )

        showToast(
          'Appointment approved successfully.',
          'success'
        )

      } else {

        const message =
          result.payload?.message ||
          result.payload ||
          'Failed to approve appointment.'

        showToast(
          typeof message === 'string'
            ? message
            : 'Failed to approve appointment.',
          'error'
        )

      }

    }

  // ==========================================================
  // CANCEL
  // ==========================================================

  const handleCancelAppointment =
    async (id) => {

      const result =
        await dispatch(
          cancelAppointments(id)
        )

      if (
        result?.meta?.requestStatus ===
        'rejected'
      ) {

        const message =
          result.payload?.message ||
          result.payload ||
          result.error?.message ||
          'Failed to cancel appointment.'

        showToast(
          typeof message === 'string'
            ? message
            : 'Failed to cancel appointment.',
          'error'
        )

        return

      }

      await dispatch(
        fetchAppointments()
      )

      // Added for T19
      setStatusMessage(
        'Appointment deleted successfully.'
      )

      showToast(
        'Appointment deleted successfully.',
        'success'
      )

    }

  // ==========================================================
  // FORM SUCCESS
  // ==========================================================

  const handleFormSuccess =
    async () => {

      setShowForm(false)

      await dispatch(
        fetchAppointments()
      )

      showToast(
        'Appointment scheduled successfully.',
        'success'
      )

    }

  // ==========================================================
  // FORM CANCEL
  // ==========================================================

  const handleFormCancel = () => {
    setShowForm(false)
  }

  // ==========================================================
  // ADMIN APPOINTMENT FORM
  // ==========================================================

  if (
    showForm &&
    isAdmin
  ) {

    return (

      <div className="appointment-list">

        <AppointmentForm
          onSuccess={
            handleFormSuccess
          }
          onCancel={
            handleFormCancel
          }
          patients={
            patients
          }
          professionals={
            professionals
          }
        />

        {professionalError && (

          <p className="error-message">
            {professionalError}
          </p>

        )}

      </div>

    )

  }

  // ==========================================================
  // MAIN
  // ==========================================================

  return (

    <div className="appointment-list">

      {/* HEADER */}

      <div className="list-header">

        <div>

          <h1>
            Clinical Schedule
          </h1>

        </div>

        {isAdmin && (

          <button
            type="button"
            className="primary-btn"
            onClick={
              handleNewAppointment
            }
          >
            + New Appointment
          </button>

        )}

      </div>

      {/* T19 SUCCESS MESSAGE */}

      {statusMessage && (

        <p className="status-message">
          {statusMessage}
        </p>

      )}

      {/* LOADING */}

      {appointmentLoading ? (

        <p>
          Loading appointments...
        </p>

      ) : appointments.length === 0 ? (

        <p>
          No appointments found.
        </p>

      ) : (

        <table
          className={
            isDoctor
              ? 'appointment-table doctor-table'
              : 'appointment-table admin-table'
          }
        >

          <thead>

            <tr>

              <th>
                Patient
              </th>

              <th>
                Physician
              </th>

              <th>
                Scheduled For
              </th>

              <th>
                Status
              </th>

              {isDoctor && (

                <th>
                  Action
                </th>

              )}

            </tr>

          </thead>

          <tbody>

            {appointments.map(
              (appointment) => {

                const status =
                  appointment.status ||
                  'PENDING'

                return (

                  <tr
                    key={
                      appointment.id
                    }
                  >

                    <td>
                      {
                        appointment.patientName ||
                        ''
                      }
                    </td>

                    <td>
                      {
                        appointment.doctorName ||
                        ''
                      }
                    </td>

                    <td>
                      {
                        appointment.appointmentDate ||
                        ''
                      }
                    </td>

                    <td>

                      <span
                        className={
                          status === 'APPROVED'
                            ? 'appointment-status approved'
                            : status === 'CANCELLED'
                              ? 'appointment-status cancelled'
                              : 'appointment-status pending'
                        }
                      >
                        {status}
                      </span>

                    </td>

                    {isDoctor && (

                      <td>

                        {status === 'PENDING' ? (

                          <div className="appointment-actions">

                            <button
                              type="button"
                              className="approve-btn"
                              onClick={() =>
                                handleApprove(
                                  appointment.id
                                )
                              }
                            >
                              Approve
                            </button>

                            <button
                              type="button"
                              className="cancel-btn"
                              onClick={() =>
                                handleCancelAppointment(
                                  appointment.id
                                )
                              }
                            >
                              Cancel
                            </button>

                          </div>

                        ) : (

                          <span className="action-completed">
                            Completed
                          </span>

                        )}

                      </td>

                    )}

                  </tr>

                )

              }
            )}

          </tbody>

        </table>

      )}

    </div>

  )
}

export default AppointmentList
