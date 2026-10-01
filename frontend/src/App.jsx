import ErrorHandler from './components/ErrorHandler'
import PatientProfile from './components/patient/PatientProfile'
import AdminProfile from './components/admin/AdminProfile'
import ProfessionalProfile from './components/professionals/ProfessionalProfile'

import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate
} from 'react-router-dom'

import Navbar from './components/layout/Navbar'
import Dashboard from './components/layout/Dashboard'
import PatientList from './components/patient/PatientList'
import VitalSignList from './components/vitals/VitalSignList'
import AppointmentList from './components/appointments/AppointmentList'
import ProfessionalList from './components/professionals/ProfessionalList'
import Login from './components/Login'
import Home from './components/Home'

import { useSelector } from 'react-redux'

import Footer from './components/layout/Footer'

// Global Toast
import { ToastProvider } from './context/ToastContext'

import './App.css'

function App() {
  const { isAuthenticated, role } = useSelector(
    (state) => state.auth
  )

  const normalizedRole =
    (role || '')
      .toUpperCase()
      .replace('ROLE_', '')

  return (
    <BrowserRouter>

      <ToastProvider>

        <ErrorHandler />

        {isAuthenticated ? (
          <div className="app-layout">

            <Navbar />

            <div className="app-body">

              <aside className="sidebar">

  <nav>

    {/* Dashboard */}
    <NavLink
      to="/dashboard"
      className={({ isActive }) =>
        isActive ? 'active' : ''
      }
    >
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </svg>

      <span>Dashboard</span>
    </NavLink>

    {/* Patients */}
    {normalizedRole !== 'PATIENT' && (
      <NavLink
        to="/patients"
        className={({ isActive }) =>
          isActive ? 'active' : ''
        }
      >
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="3" />
          <path d="M5 20C5 16.7 8.1 14 12 14C15.9 14 19 16.7 19 20" />
        </svg>

        <span>Patients</span>
      </NavLink>
    )}

    {/* Vital Signs */}
    {(normalizedRole === 'DOCTOR' ||
      normalizedRole === 'PATIENT') && (
      <NavLink
        to="/vitals"
        className={({ isActive }) =>
          isActive ? 'active' : ''
        }
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M3 12H7L9 5L13 19L15 12H21" />
        </svg>

        <span>Vital Signs</span>
      </NavLink>
    )}

    {/* Appointments */}
    <NavLink
      to="/appointments"
      className={({ isActive }) =>
        isActive ? 'active' : ''
      }
    >
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3V7" />
        <path d="M16 3V7" />
        <path d="M4 10H20" />
      </svg>

      <span>Appointments</span>
    </NavLink>

    {/* Medical Professionals */}
    {normalizedRole === 'ADMIN' && (
      <NavLink
        to="/professionals"
        className={({ isActive }) =>
          isActive ? 'active' : ''
        }
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M6 4V10C6 13.3 8.7 16 12 16C15.3 16 18 13.3 18 10V4" />
          <path d="M4 4H8" />
          <path d="M16 4H20" />
          <path d="M12 16V18C12 20.2 13.8 22 16 22C18.2 22 20 20.2 20 18V16" />
          <circle cx="20" cy="14" r="2" />
        </svg>

        <span>Medical Professionals</span>
      </NavLink>
    )}

  </nav>

</aside>

              <main className="main-content">

                <Routes>

                  <Route
                    path="/dashboard"
                    element={<Dashboard />}
                  />

                  <Route
                    path="/patients"
                    element={
                      normalizedRole === 'PATIENT' ? (
                        <Navigate
                          to="/dashboard"
                          replace
                        />
                      ) : (
                        <PatientList />
                      )
                    }
                  />

                  <Route
                    path="/vitals"
                    element={
                      normalizedRole === 'DOCTOR' ||
                      normalizedRole === 'PATIENT' ? (
                        <VitalSignList />
                      ) : (
                        <Navigate
                          to="/dashboard"
                          replace
                        />
                      )
                    }
                  />

                  <Route
                    path="/appointments"
                    element={<AppointmentList />}
                  />

                  <Route
                    path="/professionals"
                    element={
                      normalizedRole === 'ADMIN' ? (
                        <ProfessionalList />
                      ) : (
                        <Navigate
                          to="/dashboard"
                          replace
                        />
                      )
                    }
                  />

                  <Route
                    path="/patient-profile"
                    element={
                      normalizedRole === 'PATIENT' ? (
                        <PatientProfile />
                      ) : (
                        <Navigate
                          to="/dashboard"
                          replace
                        />
                      )
                    }
                  />

                  <Route
                    path="/admin-profile"
                    element={
                      normalizedRole === 'ADMIN'
                        ? <AdminProfile />
                        : <Navigate
                            to="/dashboard"
                            replace
                          />
                    }
                  />

                  <Route
                    path="/professional-profile"
                    element={
                      normalizedRole === 'DOCTOR'
                        ? <ProfessionalProfile />
                        : <Navigate
                            to="/dashboard"
                            replace
                          />
                    }
                  />

                  <Route
                    path="*"
                    element={
                      <Navigate
                        to="/dashboard"
                        replace
                      />
                    }
                  />

                </Routes>

              </main>

            </div>

            <Footer />

          </div>

        ) : (

          <Routes>

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={
                <Login view="register" />
              }
            />

            <Route
              path="*"
              element={<Home />}
            />

          </Routes>

        )}

      </ToastProvider>

    </BrowserRouter>
  )
}

export default App
