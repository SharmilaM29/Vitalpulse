import React from 'react'
import { useSelector } from 'react-redux'

function AdminProfile() {
  const { user, role } = useSelector(
    (state) => state.auth || {}
  )

  const displayName =
    user?.fullName ||
    user?.username ||
    'Administrator'

  const username =
    user?.username ||
    'Not available'

  const gender =
    user?.gender ||
    'Not provided'

  const email =
    user?.email ||
    'Not provided'

  const phone =
    user?.phone ||
    'Not provided'

  const normalizedRole =
    (role || user?.role || 'ADMIN')
      .toUpperCase()
      .replace('ROLE_', '')

  return (
    <div className="profile-page">

      <div className="profile-header">

        <div className="large-profile-avatar">
          👨‍💼
        </div>

        <div>
          <h1>{displayName}</h1>
          <p>{normalizedRole}</p>
        </div>

      </div>

      <div className="profile-card">

        <h2>Administrator Details</h2>

        <div className="profile-grid">

          <div className="profile-field">
            <span>Full Name</span>
            <strong>{displayName}</strong>
          </div>

          <div className="profile-field">
            <span>Username</span>
            <strong>{username}</strong>
          </div>

          <div className="profile-field">
            <span>Gender</span>
            <strong>{gender}</strong>
          </div>

          <div className="profile-field">
            <span>Email ID</span>
            <strong>{email}</strong>
          </div>

          <div className="profile-field">
            <span>Phone Number</span>
            <strong>{phone}</strong>
          </div>

          <div className="profile-field">
            <span>Role</span>
            <strong>{normalizedRole}</strong>
          </div>

        </div>

      </div>

    </div>
  )
}

export default AdminProfile
