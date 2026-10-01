import React, { useState } from 'react'
import Login from './Login'

function Home() {
  const [mode, setMode] = useState(null)

  const closeModal = () => {
    setMode(null)
  }

  return (
    <div className="home-page">

      <div className="home-overlay"></div>

      <div className="home-card">

        <div className="home-logo">
          VitalPulse
        </div>

        <h1>
          Smart Healthcare Management
        </h1>

        <p>
          Manage patients, monitor vital signs,
          appointments, and medical professionals
          in one secure healthcare system.
        </p>

        <div className="home-buttons">

          <button
            type="button"
            className="home-login-btn"
            onClick={() => setMode('login')}
          >
            Login
          </button>

          <button
            type="button"
            className="home-register-btn"
            onClick={() => setMode('register')}
          >
            Register
          </button>

        </div>

      </div>

      {mode && (
        <div
          className="auth-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="auth-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <Login view={mode} />
          </div>
        </div>
      )}

    </div>
  )
}

export default Home
