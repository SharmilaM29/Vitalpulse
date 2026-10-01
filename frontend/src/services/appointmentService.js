import api from './api'

export const getAppointments = () =>
  api.get('/appointments/')

export const createAppointment = (data) =>
  api.post('/appointments/', data)

export const approveAppointment = (id) =>
  api.put(`/appointments/${id}/approve`)

export const cancelAppointment = (id) =>
  api.put(`/appointments/${id}/cancel`)