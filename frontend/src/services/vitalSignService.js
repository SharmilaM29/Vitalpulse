import api from "./api"

export const getVitals=()=> api.get('/vitals/')
export const logVital=(data)=> api.post('/vitals/', data )
export const deleteVital=(id)=> api.delete(`/vitals/${id}`)
