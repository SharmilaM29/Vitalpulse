import React from 'react'
import {
  useDispatch,
  useSelector
} from 'react-redux'

import {
  logout
} from '../../store/slices/authSlice'

function Navbar() {
  const dispatch = useDispatch()

  const {
    user,
    role
  } = useSelector(
    (state) => state.auth || {}
  )

  const normalizedRole =
    (role || user?.role || '')
      .toUpperCase()
      .replace('ROLE_', '')

  const displayName =
    user?.fullName ||
    user?.name ||
    user?.username ||
    'User'

  const navigate = (path) => {
    if (
      typeof window !== 'undefined' &&
      window.history &&
      window.location.pathname !== path
    ) {
      window.history.pushState(
        {},
        '',
        path
      )

      window.dispatchEvent(
        new PopStateEvent('popstate')
      )
    }
  }

  const handleDashboard = () => {
    if (normalizedRole === 'ADMIN') {
      navigate('/admin/dashboard')
    } else if (normalizedRole === 'DOCTOR') {
      navigate('/doctor/dashboard')
    } else if (normalizedRole === 'PATIENT') {
      navigate('/patient/dashboard')
    } else {
      navigate('/')
    }
  }

  const handleProfile = () => {
    if (normalizedRole === 'ADMIN') {
      navigate('/admin-profile')
    } else if (normalizedRole === 'DOCTOR') {
      navigate('/professional-profile')
    } else if (normalizedRole === 'PATIENT') {
      navigate('/patient-profile')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    dispatch(logout())

    navigate('/')
  }

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div
        className="navbar-logo"
        onClick={handleDashboard}
        role="button"
        tabIndex={0}
      >
        <span className="logo-icon">
          ❤️
        </span>

        <span className="logo-text">
          VitalPulse
        </span>
      </div>

      {/* USER SECTION */}
      <div className="navbar-user">

        {/* PROFILE */}
        <div
          className="navbar-profile"
          onClick={handleProfile}
          role="button"
          tabIndex={0}
        >
          <span className="profile-icon">
            👤
          </span>

          <span className="profile-name">
            {displayName}
          </span>
        </div>

        {/* LOGOUT */}
        <button
          type="button"
          className="navbar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </nav>
  )
}

export default Navbar