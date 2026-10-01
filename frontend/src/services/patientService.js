import api from './api'

export const getPatients = () =>
  api.get('/patients/')

export const getMyPatients = () =>
  api.get('/patients/my-patients')

export const getMyProfile = () =>
  api.get('/patients/my-profile')

export const getPatientById = (id) =>
  api.get(`/patients/${id}`)

export const enrollPatient = (data) =>
  api.post('/patients/', data)

export const updatePatient = (id, data) =>
  api.put(`/patients/${id}`, data)

export const deletePatient = (id) =>
  api.delete(`/patients/${id}`)