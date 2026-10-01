import React, {
  useState
} from 'react'

import { useDispatch } from 'react-redux'

import {
  loginSuccess
} from '../store/slices/authSlice'

import {
  login,
  register
} from '../services/authService'

import {
  useToast
} from '../context/ToastContext'

const initialFormState = {
  username: '',
  password: '',
  role: '',
  gender: '',
  email: '',
  phone: ''
}

function Login({
  view = 'login'
}) {
  const dispatch = useDispatch()
  const { showToast } = useToast()

  const [mode, setMode] = useState(
  view === 'register' ? 'register' : 'login'
)

  const [formData, setFormData] =
    useState(initialFormState)

  const [statusMessage, setStatusMessage] =
  useState('')

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

  const toggleMode = () => {
    setMode((prev) =>
      prev === 'login'
        ? 'register'
        : 'login'
    )

    setFormData(
      initialFormState
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // REGISTER
      if (mode === 'register') {
        await register(formData)

        setFormData(
          initialFormState
        )

        setMode('login')

        setStatusMessage(
          'User registered successfully.'
        )

        showToast(
          'User registered successfully.',
          'success'
        )

        return
      }

      // LOGIN
      const response =
        await login({
          username:
            formData.username,
          password:
            formData.password
        })

      const data =
        response.data

      localStorage.setItem(
        'token',
        data.token
      )

      localStorage.setItem(
        'user',
        JSON.stringify(data)
      )

      dispatch(
        loginSuccess(data)
      )

      showToast(
        'Login successful.',
        'success'
      )

    } catch (error) {
      console.error(
        'Authentication error:',
        error
      )

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        'Something went wrong. Please try again.'

      showToast(
        typeof message === 'string'
          ? message
          : 'Something went wrong. Please try again.',
        'error'
      )
    }
  }

  return (
    <div className="login-container">

      <h2>
        {mode === 'login'
          ? 'Login'
          : 'Register'}
      </h2>

      <form
        onSubmit={handleSubmit}
        noValidate={mode === 'register'}
      >

        {/* USERNAME */}
        <div className="form-group">

          <label htmlFor="username">
            Username
          </label>

          <input
            id="username"
            name="username"
            type="text"
            value={
              formData.username
            }
            placeholder="e.g. nurse_smith"
            onChange={handleChange}
            required
          />

        </div>

        {/* REGISTRATION FIELDS */}
        {mode === 'register' && (
          <>

            {/* GENDER */}
            <div className="form-group">

              <label htmlFor="gender">
                Gender
              </label>

              <select
                id="gender"
                name="gender"
                value={
                  formData.gender
                }
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            {/* EMAIL */}
            <div className="form-group">

              <label htmlFor="email">
                Email ID
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={
                  formData.email
                }
                placeholder="example@gmail.com"
                onChange={handleChange}
                required
              />

            </div>

            {/* PHONE */}
            <div className="form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={
                  formData.phone
                }
                placeholder="+91 9876543210"
                onChange={handleChange}
                required
              />

            </div>

          </>
        )}

        {/* PASSWORD */}
        <div className="form-group">

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={
              formData.password
            }
            placeholder="Enter password"
            onChange={handleChange}
            required
          />

        </div>

        {/* ROLE */}
        {mode === 'register' && (
          <div className="form-group">

            <label htmlFor="role">
              Role
            </label>

            <select
              id="role"
              name="role"
              value={
                formData.role
              }
              onChange={handleChange}
              required
            >

              <option value="">
                Select Role
              </option>

              <option value="ADMIN">
                Admin
              </option>

            </select>

          </div>
        )}

        {/* BUTTONS */}
        <div className="auth-button-row">

          <button
            id="register-btn-t27"
            type="submit"
            className="primary-btn"
            style={{
              marginTop: '1rem'
            }}
          >
            {mode === 'login'
              ? 'Login'
              : 'Register Now'}
          </button>

          <button
            type="button"
            className="link-btn"
            onClick={toggleMode}
          >
            {mode === 'login'
              ? 'Need an account? Register'
              : 'Already have an account? Login'}
          </button>

        </div>

      </form>

      {statusMessage && (
          <p className="status-message">
            {statusMessage}
          </p>
      )}

    </div>
  )
}

export default Login
