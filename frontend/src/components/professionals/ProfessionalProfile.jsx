import React, { useEffect, useState } from 'react'
import api from '../../services/api'

function ProfessionalProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get('/professionals/my-profile')
        setProfile(response.data)
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.response?.data ||
          'Unable to load professional profile.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <p className="error-message">{error}</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <p>Professional profile not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">

      <div className="profile-header">
        <div className="large-profile-avatar">
          {(profile.name || 'Professional')
            .split(' ')
            .map((name) => name.charAt(0))
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>

        <div>
          <h1>Professional Profile</h1>
          <p>{profile.name}</p>
        </div>
      </div>

      <div className="profile-card">

        <h2>Professional Information</h2>

        <div className="profile-grid">

          <div className="profile-field">
            <strong>Full Name</strong>
            <span>{profile.name || 'Not available'}</span>
          </div>

          <div className="profile-field">
            <strong>Username</strong>
            <span>{profile.username || 'Not available'}</span>
          </div>

          <div className="profile-field">
            <strong>Role</strong>
            <span>{profile.role || 'DOCTOR'}</span>
          </div>

          <div className="profile-field">
            <strong>Specialization</strong>
            <span>
              {profile.specialization || 'Not available'}
            </span>
          </div>

          <div className="profile-field">
            <strong>Employee ID</strong>
            <span>
              {profile.employeeId || 'Not available'}
            </span>
          </div>

        </div>

      </div>

    </div>
  )
}

export default ProfessionalProfile
