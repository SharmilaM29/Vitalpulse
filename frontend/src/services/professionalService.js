import api from './api'

export const fetchProfessionalsList = () =>
  api.get('/professionals/')

export const registerProfessional = (data) =>
  api.post('/professionals/', data)

export const updateProfessional = (id, data) =>
  api.put(`/professionals/${id}`, data)

export const deleteProfessional = (id) =>
  api.delete(`/professionals/${id}`)
