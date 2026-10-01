import { configureStore } from "@reduxjs/toolkit";
import authReader from './slices/authSlice'
import patientReader from './slices/patientSlice'
import vitalSignReducer from './slices/vitalSignSlice'
import appointmentReducer from './slices/appointmentSlice'
import professionalReducer from './slices/professionalSlice'
import notificationReducer from './slices/notificationSlice'

const store=configureStore({
    reducer:{
        auth: authReader,
        patients: patientReader,
        vitals: vitalSignReducer,
        appointments: appointmentReducer,
        professionals: professionalReducer,
        notifications: notificationReducer
    }
})

export default store;
