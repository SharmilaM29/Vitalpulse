import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  fetchPatients,
  fetchMyPatients
} from '../../store/slices/patientSlice'

import {
  fetchAppointments
} from '../../store/slices/appointmentSlice'

function Dashboard() {

  const dispatch = useDispatch()

  const navigate = (path) => {

    if (window.location.pathname === path) {
      return
    }

    window.history.pushState({}, '', path)

    window.dispatchEvent(
      new PopStateEvent('popstate')
    )
  }

  const {
    role,
    user
  } = useSelector(
    (state) => state.auth || {}
  )

  const patients =
    useSelector(
      (state) => state.patients?.items
    ) || []

  const appointments =
    useSelector(
      (state) => state.appointments?.items
    ) || []

  const vitals =
    useSelector(
      (state) => state.vitals?.items
    ) || []

  const professionals =
    useSelector(
      (state) => state.professionals?.items
    ) || []

  const normalizedRole =
    (role || '')
      .toUpperCase()
      .replace('ROLE_', '')

  const isAdmin =
    normalizedRole === 'ADMIN'

  const isDoctor =
    normalizedRole === 'DOCTOR'

  const isPatient =
    normalizedRole === 'PATIENT'

  const displayName =
    user?.fullName ||
    user?.name ||
    user?.username ||
    (
      isAdmin
        ? 'Admin'
        : isDoctor
          ? 'Doctor'
          : isPatient
            ? 'Patient'
            : 'User'
    )

  const username =
    user?.username || ''

  const userId =
    user?.id ||
    user?.userId ||
    null

  useEffect(() => {

    if (isAdmin) {
      dispatch(fetchPatients())
    }

    if (isDoctor) {
      dispatch(fetchMyPatients())
    }

    if (
      isAdmin ||
      isDoctor ||
      isPatient
    ) {
      dispatch(fetchAppointments())
    }

  }, [
    dispatch,
    isAdmin,
    isDoctor,
    isPatient
  ])

  const today =
    new Date()

  const todayString =
    today.getFullYear() +
    '-' +
    String(
      today.getMonth() + 1
    ).padStart(2, '0') +
    '-' +
    String(
      today.getDate()
    ).padStart(2, '0')

  const getPatientName =
    (appointment) => {

      return (
        appointment?.patientName ||
        appointment?.patient?.fullName ||
        appointment?.patient?.name ||
        appointment?.patient?.username ||
        'Patient'
      )
    }

  const getDoctorName =
    (appointment) => {

      return (
        appointment?.doctorName ||
        appointment?.doctor?.fullName ||
        appointment?.doctor?.name ||
        appointment?.doctor?.username ||
        'Doctor'
      )
    }

  const getVitalPatientName =
    (vital) => {

      return (
        vital?.patientName ||
        vital?.patient?.fullName ||
        vital?.patient?.name ||
        vital?.patient?.username ||
        vital?.patient ||
        'Patient'
      )
    }

  const formatDate =
    (value) => {

      if (!value) {
        return 'Not available'
      }

      const date =
        new Date(value)

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return value
      }

      return date.toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      )
    }

  const formatDateTime =
    (value) => {

      if (!value) {
        return 'Recently'
      }

      const date =
        new Date(value)

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return value
      }

      return date.toLocaleString(
        'en-IN',
        {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }
      )
    }

  const getStatusText =
    (status) => {

      const normalized =
        (
          status ||
          'PENDING'
        ).toUpperCase()

      if (
        normalized ===
        'APPROVED'
      ) {
        return 'Confirmed'
      }

      if (
        normalized ===
        'CANCELLED'
      ) {
        return 'Cancelled'
      }

      if (
        normalized ===
        'COMPLETED'
      ) {
        return 'Completed'
      }

      return 'Waiting'
    }

  const getStatusClass =
    (status) => {

      const normalized =
        (
          status ||
          'PENDING'
        ).toUpperCase()

      if (
        normalized ===
        'APPROVED'
      ) {
        return 'doctor-status approved'
      }

      if (
        normalized ===
        'CANCELLED'
      ) {
        return 'doctor-status cancelled'
      }

      return 'doctor-status pending'
    }

  const getPatientStatus =
    (patient) => {

      const status =
        (
          patient?.status ||
          patient?.patientStatus ||
          'OUTPATIENT'
        )
          .toString()
          .toLowerCase()

      if (
        status.includes('admit')
      ) {
        return 'admitted'
      }

      if (
        status.includes('discharg')
      ) {
        return 'discharged'
      }

      if (
        status.includes(
          'outpatient'
        ) ||
        status.includes(
          'out-patient'
        )
      ) {
        return 'outpatient'
      }

      return 'unknown'
    }

  const getInitials =
    (name) => {

      return (
        name
          .split(' ')
          .filter(Boolean)
          .map(
            (part) =>
              part.charAt(0)
          )
          .join('')
          .slice(0, 2)
          .toUpperCase() ||
        'U'
      )
    }

  /*
   * IMPORTANT:
   *
   * For ADMIN:
   * patients = all patients
   *
   * For DOCTOR:
   * patients = patients returned by
   * /patients/my-patients
   *
   * Therefore no frontend doctor matching
   * is required anymore.
   */

  const doctorPatients =
    isDoctor
      ? patients
      : []

  const todaysAppointments =
    appointments
      .filter(
        (appointment) =>
          (
            appointment?.appointmentDate ||
            ''
          ).startsWith(
            todayString
          )
      )
      .sort(
        (a, b) =>
          (
            a?.appointmentDate ||
            ''
          ).localeCompare(
            b?.appointmentDate ||
            ''
          )
      )

  const waitingAppointments =
    todaysAppointments.filter(
      (appointment) =>
        (
          appointment?.status ||
          ''
        ).toUpperCase() ===
        'PENDING'
    )

  const totalPatients =
    patients.length

  const totalAppointments =
    appointments.length

  const doctorNamesFromAppointments =
    [
      ...new Set(
        appointments
          .map(
            (appointment) =>
              getDoctorName(
                appointment
              )
          )
          .filter(
            (name) =>
              name &&
              name !== 'Doctor'
          )
      )
    ]

  const totalDoctors =
    professionals.length > 0
      ? professionals.length
      : doctorNamesFromAppointments.length

  const admittedPatients =
    patients.filter(
      (patient) =>
        getPatientStatus(
          patient
        ) === 'admitted'
    ).length

  const outpatientPatients =
    patients.filter(
      (patient) =>
        getPatientStatus(
          patient
        ) === 'outpatient'
    ).length

  const dischargedPatients =
    patients.filter(
      (patient) =>
        getPatientStatus(
          patient
        ) === 'discharged'
    ).length

  const unknownPatients =
    patients.filter(
      (patient) =>
        getPatientStatus(
          patient
        ) === 'unknown'
    ).length

  const statusTotal =
    admittedPatients +
    outpatientPatients +
    dischargedPatients +
    unknownPatients

  const admittedPercentage =
    statusTotal > 0
      ? (
          admittedPatients /
          statusTotal
        ) * 100
      : 0

  const outpatientPercentage =
    statusTotal > 0
      ? (
          outpatientPatients /
          statusTotal
        ) * 100
      : 0

  const dischargedPercentage =
    statusTotal > 0
      ? (
          dischargedPatients /
          statusTotal
        ) * 100
      : 0

  const donutBackground =
    statusTotal === 0
      ? '#eef1f8'
      : `conic-gradient(
          #4f46e5 0 ${admittedPercentage}%,
          #22c55e ${admittedPercentage}% ${
            admittedPercentage +
            outpatientPercentage
          }%,
          #94a3b8 ${
            admittedPercentage +
            outpatientPercentage
          }% ${
            admittedPercentage +
            outpatientPercentage +
            dischargedPercentage
          }%,
          #cbd5e1 ${
            admittedPercentage +
            outpatientPercentage +
            dischargedPercentage
          }% 100%
        )`

  const doctorAppointmentCounts =
    {}

  appointments.forEach(
    (appointment) => {

      const doctor =
        getDoctorName(
          appointment
        )

      if (
        doctor !== 'Doctor'
      ) {

        doctorAppointmentCounts[
          doctor
        ] =
          (
            doctorAppointmentCounts[
              doctor
            ] || 0
          ) + 1
      }
    }
  )

  const doctorChartData =
    Object.entries(
      doctorAppointmentCounts
    )
      .sort(
        (a, b) =>
          b[1] - a[1]
      )
      .slice(0, 5)

  const maxDoctorAppointments =
    doctorChartData.length > 0
      ? Math.max(
          ...doctorChartData.map(
            ([, count]) =>
              count
          )
        )
      : 1

  const adminActivities = [
    ...patients.map(
      (patient) => ({
        id:
          `patient-${patient?.id}`,
        type:
          'patient',
        name:
          patient?.fullName ||
          patient?.name ||
          (
            `${patient?.firstName || ''} ${
              patient?.lastName || ''
            }`
          ).trim() ||
          patient?.username ||
          'Patient',
        date:
          patient?.createdAt ||
          patient?.registeredAt ||
          null
      })
    ),

    ...appointments.map(
      (appointment) => ({
        id:
          `appointment-${appointment?.id}`,
        type:
          'appointment',
        name:
          getPatientName(
            appointment
          ),
        date:
          appointment?.appointmentDate ||
          null,
        status:
          appointment?.status
      })
    ),

    ...vitals.map(
      (vital) => ({
        id:
          `vital-${vital?.id}`,
        type:
          'vital',
        name:
          getVitalPatientName(
            vital
          ),
        date:
          vital?.recordedAt ||
          null
      })
    )
  ]
    .sort(
      (a, b) =>
        new Date(
          b.date || 0
        ) -
        new Date(
          a.date || 0
        )
    )
    .slice(0, 5)

  const patientAppointments =
    appointments.filter(
      (appointment) => {

        const appointmentPatientId =
          appointment?.patientId ||
          appointment?.patient?.id ||
          appointment?.patient?.userId

        const appointmentUsername =
          appointment?.patientUsername ||
          appointment?.patient?.username

        const appointmentName =
          appointment?.patientName ||
          appointment?.patient?.fullName ||
          appointment?.patient?.name

        if (
          userId &&
          appointmentPatientId &&
          String(
            appointmentPatientId
          ) === String(userId)
        ) {
          return true
        }

        if (
          username &&
          appointmentUsername &&
          username ===
            appointmentUsername
        ) {
          return true
        }

        if (
          displayName &&
          appointmentName &&
          appointmentName ===
            displayName
        ) {
          return true
        }

        return false
      }
    )

  const upcomingPatientAppointments =
    patientAppointments
      .filter(
        (appointment) =>
          (
            appointment?.status ||
            ''
          ).toUpperCase() !==
          'CANCELLED'
      )
      .sort(
        (a, b) =>
          (
            a?.appointmentDate ||
            ''
          ).localeCompare(
            b?.appointmentDate ||
            ''
          )
      )

  const patientVitals =
    vitals
      .filter(
        (vital) => {

          const vitalPatientId =
            vital?.patientId ||
            vital?.patient?.id ||
            vital?.patient?.userId

          const vitalUsername =
            vital?.patientUsername ||
            vital?.patient?.username

          const vitalName =
            vital?.patientName ||
            vital?.patient?.fullName ||
            vital?.patient?.name ||
            vital?.patient

          if (
            userId &&
            vitalPatientId &&
            String(
              vitalPatientId
            ) === String(userId)
          ) {
            return true
          }

          if (
            username &&
            vitalUsername &&
            username ===
              vitalUsername
          ) {
            return true
          }

          if (
            displayName &&
            vitalName &&
            vitalName ===
              displayName
          ) {
            return true
          }

          return false
        }
      )
      .sort(
        (a, b) =>
          new Date(
            b?.recordedAt || 0
          ) -
          new Date(
            a?.recordedAt || 0
          )
      )

  const latestVital =
    patientVitals.length > 0
      ? patientVitals[0]
      : null

  const latestPatientAppointment =
    upcomingPatientAppointments[0] ||
    null

  if (isAdmin) {

    return (
      <div className="admin-dashboard">

        <div className="admin-dashboard-header">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back, {displayName}.
              Here's what's happening in
              VitalPulse today.
            </p>

          </div>

          <div className="dashboard-date">

            <span className="dashboard-date-icon">
              📅
            </span>

            <div>

              <strong>
                {today.toLocaleDateString(
                  'en-IN',
                  {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  }
                )}
              </strong>

              <span>
                System Status: Operational
              </span>

            </div>

          </div>

        </div>

        <div className="admin-kpi-grid">

          <button
            type="button"
            className="admin-kpi-card patients-kpi"
            onClick={() =>
              navigate('/patients')
            }
          >

            <span className="kpi-icon">
              👥
            </span>

            <span className="kpi-content">

              <span className="kpi-label">
                Total Patients
              </span>

              <strong className="kpi-value">
                {totalPatients}
              </strong>

              <span className="kpi-subtext">
                Registered patients
              </span>

            </span>

          </button>

          <button
            type="button"
            className="admin-kpi-card doctors-kpi"
            onClick={() =>
              navigate('/professionals')
            }
          >

            <span className="kpi-icon">
              🩺
            </span>

            <span className="kpi-content">

              <span className="kpi-label">
                Medical Professionals
              </span>

              <strong className="kpi-value">
                {totalDoctors}
              </strong>

              <span className="kpi-subtext">
                Active professionals
              </span>

            </span>

          </button>

          <button
            type="button"
            className="admin-kpi-card appointments-kpi"
            onClick={() =>
              navigate('/appointments')
            }
          >

            <span className="kpi-icon">
              📅
            </span>

            <span className="kpi-content">

              <span className="kpi-label">
                Appointments
              </span>

              <strong className="kpi-value">
                {totalAppointments}
              </strong>

              <span className="kpi-subtext">
                {todaysAppointments.length}
                <span>•</span>
                Today
              </span>

            </span>

          </button>

        </div>

        <div className="admin-main-grid">

          <div className="admin-panel">

            <div className="admin-panel-header">

              <div>

                <h2>
                  Appointments by Doctor
                </h2>

                <p>
                  Appointment distribution
                  across medical professionals
                </p>

              </div>

              <button
                type="button"
                className="panel-action"
                onClick={() =>
                  navigate('/appointments')
                }
              >
                View All
              </button>

            </div>

            {doctorChartData.length === 0 ? (

              <div className="dashboard-empty">

                <span>
                  📊
                </span>

                <p>
                  No doctor appointment data
                  available.
                </p>

              </div>

            ) : (

              <div className="doctor-chart">

                {doctorChartData.map(
                  ([doctor, count]) => {

                    const width =
                      Math.max(
                        8,
                        (
                          count /
                          maxDoctorAppointments
                        ) * 100
                      )

                    return (
                      <button
                        type="button"
                        className="doctor-chart-row"
                        key={doctor}
                        onClick={() =>
                          navigate(
                            '/appointments'
                          )
                        }
                      >

                        <span className="doctor-chart-name">
                          {doctor}
                        </span>

                        <span className="doctor-chart-track">

                          <span
                            className="doctor-chart-bar"
                            style={{
                              width:
                                `${width}%`
                            }}
                          />

                        </span>

                        <span className="doctor-chart-count">
                          {count}
                        </span>

                      </button>
                    )
                  }
                )}

              </div>
            )}

          </div>

          <div className="admin-panel">

            <div className="admin-panel-header">

              <div>

                <h2>
                  Patient Status
                </h2>

                <p>
                  Current patient distribution
                </p>

              </div>

              <button
                type="button"
                className="panel-action"
                onClick={() =>
                  navigate('/patients')
                }
              >
                View Patients
              </button>

            </div>

            <div className="patient-status-content">

              <div
                className="patient-donut"
                style={{
                  background:
                    donutBackground
                }}
              >

                <div className="patient-donut-inner">

                  <strong>
                    {totalPatients}
                  </strong>

                  <span>
                    Patients
                  </span>

                </div>

              </div>

              <div className="patient-status-legend">

                <div className="status-legend-item">

                  <span className="legend-dot admitted-dot" />

                  <div>

                    <strong>
                      Admitted
                    </strong>

                    <span>
                      {admittedPatients}
                    </span>

                  </div>

                </div>

                <div className="status-legend-item">

                  <span className="legend-dot outpatient-dot" />

                  <div>

                    <strong>
                      Outpatient
                    </strong>

                    <span>
                      {outpatientPatients}
                    </span>

                  </div>

                </div>

                <div className="status-legend-item">

                  <span className="legend-dot discharged-dot" />

                  <div>

                    <strong>
                      Discharged
                    </strong>

                    <span>
                      {dischargedPatients}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="admin-bottom-grid">

          <div className="admin-panel">

            <div className="admin-panel-header">

              <div>

                <h2>
                  Recent Activity
                </h2>

                <p>
                  Latest activity in VitalPulse
                </p>

              </div>

            </div>

            {adminActivities.length === 0 ? (

              <div className="dashboard-empty">

                <span>
                  ✓
                </span>

                <p>
                  No recent activity.
                </p>

              </div>

            ) : (

              <div className="activity-list">

                {adminActivities.map(
                  (activity) => (

                    <div
                      className="activity-item"
                      key={activity.id}
                    >

                      <span
                        className={
                          `activity-icon ${
                            activity.type
                          }`
                        }
                      >
                        {
                          activity.type ===
                          'patient'
                            ? '👤'
                            : activity.type ===
                              'appointment'
                              ? '📅'
                              : '❤️'
                        }
                      </span>

                      <div className="activity-content">

                        <strong>
                          {
                            activity.type ===
                            'patient'
                              ? `Patient ${activity.name} registered`
                              : activity.type ===
                                'appointment'
                                ? `Appointment with ${activity.name}`
                                : `Vitals recorded for ${activity.name}`
                          }
                        </strong>

                        <span>
                          {
                            activity.type ===
                            'appointment'
                              ? getStatusText(
                                  activity.status
                                )
                              : 'VitalPulse activity'
                          }
                        </span>

                      </div>

                      <span className="activity-time">

                        {formatDateTime(
                          activity.date
                        )}

                      </span>

                    </div>

                  )
                )}

              </div>
            )}

          </div>

          <div className="admin-panel">

            <div className="admin-panel-header">

              <div>

                <h2>
                  Quick Actions
                </h2>

                <p>
                  Frequently used administration
                  tools
                </p>

              </div>

            </div>

            <div className="quick-actions-grid">

              <button
                type="button"
                className="quick-action"
                onClick={() =>
                  navigate('/patients')
                }
              >

                <span className="quick-action-icon">
                  👤
                </span>

                <span>

                  <strong>
                    Manage Patients
                  </strong>

                  <small>
                    View patient records
                  </small>

                </span>

                <b>
                  →
                </b>

              </button>

              <button
                type="button"
                className="quick-action"
                onClick={() =>
                  navigate('/professionals')
                }
              >

                <span className="quick-action-icon">
                  🩺
                </span>

                <span>

                  <strong>
                    Medical Professionals
                  </strong>

                  <small>
                    Manage healthcare staff
                  </small>

                </span>

                <b>
                  →
                </b>

              </button>

              <button
                type="button"
                className="quick-action"
                onClick={() =>
                  navigate('/appointments')
                }
              >

                <span className="quick-action-icon">
                  📅
                </span>

                <span>

                  <strong>
                    Appointments
                  </strong>

                  <small>
                    Manage consultations
                  </small>

                </span>

                <b>
                  →
                </b>

              </button>

              <button
                type="button"
                className="quick-action"
                onClick={() =>
                  navigate('/vitals')
                }
              >

                <span className="quick-action-icon">
                  ❤️
                </span>

                <span>

                  <strong>
                    Vital Signs
                  </strong>

                  <small>
                    View telemetry records
                  </small>

                </span>

                <b>
                  →
                </b>

              </button>

            </div>

          </div>

        </div>

      </div>
    )
  }

  if (isDoctor) {

    const doctorRecentActivities = [

      ...vitals.map(
        (vital) => ({
          id:
            `vital-${vital?.id}`,
          type:
            'vital',
          patientName:
            getVitalPatientName(
              vital
            ),
          date:
            vital?.recordedAt
        })
      ),

      ...todaysAppointments.map(
        (appointment) => ({
          id:
            `appointment-${appointment?.id}`,
          type:
            'appointment',
          patientName:
            getPatientName(
              appointment
            ),
          date:
            appointment?.appointmentDate,
          status:
            appointment?.status
        })
      )

    ]
      .sort(
        (a, b) =>
          new Date(
            b.date || 0
          ) -
          new Date(
            a.date || 0
          )
      )
      .slice(0, 3)

    return (
      <div className="doctor-dashboard">

        <div className="doctor-dashboard-header">

          <div>

            <h1>
              Good morning, {displayName}
            </h1>

            <p>
              {today.toLocaleDateString(
                'en-IN',
                {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                }
              )}
            </p>

          </div>

          <button
            type="button"
            className="doctor-profile-button"
            onClick={() =>
              navigate(
                '/doctor-profile'
              )
            }
          >
            {getInitials(
              displayName
            )}
          </button>

        </div>

        <div className="doctor-kpi-grid">

          <button
            type="button"
            className="doctor-kpi-card"
            onClick={() =>
              navigate(
                '/appointments'
              )
            }
          >

            <span className="doctor-kpi-label">
              Today's Appointments
            </span>

            <strong className="doctor-kpi-value">
              {todaysAppointments.length}
            </strong>

          </button>

          <button
            type="button"
            className="doctor-kpi-card"
            onClick={() =>
              navigate(
                '/appointments'
              )
            }
          >

            <span className="doctor-kpi-label">
              Waiting
            </span>

            <strong className="doctor-kpi-value">
              {waitingAppointments.length}
            </strong>

          </button>

          <button
            type="button"
            className="doctor-kpi-card"
            onClick={() =>
              navigate(
                '/patients'
              )
            }
          >

            <span className="doctor-kpi-label">
              My Patients
            </span>

            <strong className="doctor-kpi-value">
              {doctorPatients.length}
            </strong>

          </button>

        </div>

        <div className="doctor-dashboard-panel">

          <div className="doctor-panel-header">

            <div>

              <h2>
                Today's Schedule
              </h2>

              <p>
                Your appointments for today
              </p>

            </div>

            <button
              type="button"
              className="doctor-panel-action"
              onClick={() =>
                navigate(
                  '/appointments'
                )
              }
            >
              View All
            </button>

          </div>

          {todaysAppointments.length === 0 ? (

            <div className="doctor-empty-state">

              <span>
                ✓
              </span>

              <p>
                No appointments scheduled
                for today.
              </p>

            </div>

          ) : (

            <div className="doctor-schedule">

              {todaysAppointments.map(
                (appointment) => {

                  const appointmentDate =
                    appointment?.appointmentDate ||
                    ''

                  const appointmentTime =
                    appointmentDate.includes(
                      'T'
                    )
                      ? appointmentDate.split(
                          'T'
                        )[1]
                      : ''

                  let formattedTime =
                    appointmentTime

                  if (
                    appointmentTime
                  ) {

                    const [
                      hours,
                      minutes
                    ] =
                      appointmentTime.split(
                        ':'
                      )

                    const date =
                      new Date()

                    date.setHours(
                      Number(hours),
                      Number(minutes),
                      0,
                      0
                    )

                    formattedTime =
                      date.toLocaleTimeString(
                        'en-IN',
                        {
                          hour:
                            '2-digit',
                          minute:
                            '2-digit'
                        }
                      )
                  }

                  return (
                    <div
                      className="doctor-schedule-row"
                      key={
                        appointment?.id
                      }
                    >

                      <span className="doctor-appointment-time">
                        {
                          formattedTime ||
                          'Time not set'
                        }
                      </span>

                      <span className="doctor-appointment-patient">
                        {
                          getPatientName(
                            appointment
                          )
                        }
                      </span>

                      <span
                        className={
                          getStatusClass(
                            appointment?.status
                          )
                        }
                      >
                        {
                          getStatusText(
                            appointment?.status
                          )
                        }
                      </span>

                      <button
                        type="button"
                        className="doctor-view-button"
                        onClick={() =>
                          navigate(
                            '/appointments'
                          )
                        }
                      >
                        View
                      </button>

                    </div>
                  )
                }
              )}

            </div>
          )}

        </div>

        <div className="doctor-dashboard-panel">

          <div className="doctor-panel-header">

            <div>

              <h2>
                Recent Activity
              </h2>

            </div>

          </div>

          {doctorRecentActivities.length === 0 ? (

            <div className="doctor-empty-state">

              <p>
                No recent activity.
              </p>

            </div>

          ) : (

            <div className="doctor-activity-list">

              {doctorRecentActivities.map(
                (activity) => (

                  <div
                    className="doctor-activity-item"
                    key={
                      activity.id
                    }
                  >

                    <span className="doctor-activity-dot" />

                    <div>

                      {activity.type ===
                      'vital' ? (

                        <>
                          <strong>
                            Vitals recorded for{' '}
                            {
                              activity.patientName
                            }
                          </strong>

                          <span>
                            {
                              formatDateTime(
                                activity.date
                              )
                            }
                          </span>
                        </>

                      ) : (

                        <>
                          <strong>
                            Appointment with{' '}
                            {
                              activity.patientName
                            }
                          </strong>

                          <span>
                            {
                              getStatusText(
                                activity.status
                              )
                            }
                          </span>
                        </>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>
          )}

        </div>

      </div>
    )
  }

  if (isPatient) {

    return (
      <div className="patient-dashboard">

        <div className="patient-dashboard-header">

          <div>

            <h1>
              Welcome, {displayName}
            </h1>

            <p>
              {today.toLocaleDateString(
                'en-IN',
                {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                }
              )}
            </p>

          </div>

        </div>

        <div className="patient-dashboard-panels">

          <div className="panel patient-health-panel">

            <h2>
              Latest Health Information
            </h2>

            {!latestVital ? (

              <div className="empty-dashboard-state">

                <div className="empty-state-icon">
                  ❤️
                </div>

                <p>
                  No vital signs recorded yet.
                </p>

                <span>
                  Your latest health information
                  will appear here.
                </span>

              </div>

            ) : (

              <>

                <div className="latest-vitals-content">

                  <div className="vital-item">

                    <span className="vital-icon heart-icon">
                      ❤️
                    </span>

                    <div className="vital-info">

                      <span>
                        Heart Rate
                      </span>

                      <strong>
                        {
                          latestVital?.heartRate ??
                          '--'
                        } bpm
                      </strong>

                      <small>
                        Latest reading
                      </small>

                    </div>

                  </div>

                  <div className="vital-item">

                    <span className="vital-icon pressure-icon">
                      🩸
                    </span>

                    <div className="vital-info">

                      <span>
                        Blood Pressure
                      </span>

                      <strong>
                        {
                          latestVital?.systolic ??
                          latestVital?.bloodPressureSystolic ??
                          '--'
                        }
                        /
                        {
                          latestVital?.diastolic ??
                          latestVital?.bloodPressureDiastolic ??
                          '--'
                        }
                      </strong>

                      <small>
                        mmHg
                      </small>

                    </div>

                  </div>

                  <div className="vital-item">

                    <span className="vital-icon temperature-icon">
                      🌡️
                    </span>

                    <div className="vital-info">

                      <span>
                        Temperature
                      </span>

                      <strong>
                        {
                          latestVital?.temperature ??
                          '--'
                        }
                      </strong>

                      <small>
                        °C
                      </small>

                    </div>

                  </div>

                  <div className="vital-item">

                    <span className="vital-icon oxygen-icon">
                      🫁
                    </span>

                    <div className="vital-info">

                      <span>
                        Oxygen Saturation
                      </span>

                      <strong>
                        {
                          latestVital?.oxygenSaturation ??
                          latestVital?.oxygen ??
                          '--'
                        }%
                      </strong>

                      <small>
                        SpO₂
                      </small>

                    </div>

                  </div>

                </div>

                <div className="vital-recorded-time">

                  Last recorded:{' '}

                  {
                    formatDateTime(
                      latestVital?.recordedAt
                    )
                  }

                </div>

              </>

            )}

          </div>

          <div className="panel patient-appointment-panel">

            <h2>
              Upcoming Appointment
            </h2>

            {!latestPatientAppointment ? (

              <div className="empty-dashboard-state">

                <div className="empty-state-icon">
                  📅
                </div>

                <p>
                  No upcoming appointments.
                </p>

                <span>
                  Your next appointment will
                  appear here.
                </span>

              </div>

            ) : (

              <div className="upcoming-appointment-content">

                <div className="doctor-avatar">
                  🩺
                </div>

                <div className="appointment-doctor">

                  <span className="appointment-label">
                    Doctor
                  </span>

                  <strong>
                    {
                      getDoctorName(
                        latestPatientAppointment
                      )
                    }
                  </strong>

                  <span className="doctor-specialization">

                    {
                      latestPatientAppointment
                        ?.doctor
                        ?.specialization ||
                      latestPatientAppointment
                        ?.specialization ||
                      'Medical Professional'
                    }

                  </span>

                </div>

                <div className="appointment-details">

                  <div>

                    <span>
                      Date
                    </span>

                    <strong>
                      {
                        formatDate(
                          latestPatientAppointment
                            ?.appointmentDate
                        )
                      }
                    </strong>

                  </div>

                  <div>

                    <span>
                      Time
                    </span>

                    <strong>

                      {
                        latestPatientAppointment
                          ?.appointmentDate
                          ?.includes('T')
                          ? new Date(
                              latestPatientAppointment
                                .appointmentDate
                            ).toLocaleTimeString(
                              'en-IN',
                              {
                                hour:
                                  '2-digit',
                                minute:
                                  '2-digit'
                              }
                            )
                          : 'Time not set'
                      }

                    </strong>

                  </div>

                </div>

                <div className="appointment-status-container">

                  <span className="appointment-label">
                    Status
                  </span>

                  <span
                    className={
                      `patient-appointment-status ${
                        (
                          latestPatientAppointment
                            ?.status ||
                          'pending'
                        ).toLowerCase()
                      }`
                    }
                  >
                    {
                      getStatusText(
                        latestPatientAppointment
                          ?.status
                      )
                    }
                  </span>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>
    )
  }

  return (
    <div
      className="dashboard"
      id="session-container-t28"
    >

      <h1
        id="hero-heading-t30"
        style={{
          fontWeight: 700
        }}
      >
        Health Intelligence Dashboard
      </h1>

      <p>
        Welcome to VitalPulse.
      </p>

      <div className="dashboard-stats">

        <div className="stat-card">

          <span className="stat-label">
            Patients
          </span>

          <strong className="stat-value">
            {patients.length}
          </strong>

        </div>

      </div>

      <p>
        Your account does not have a supported
        dashboard role.
      </p>

    </div>
  )
}

export default Dashboard