import {
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit'

import {
  getAppointments,
  approveAppointment,
  cancelAppointment
} from '../../services/appointmentService'

import {
  loginSuccess,
  logout
} from './authSlice'

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',

  async (_, { rejectWithValue }) => {
    try {
      const response =
        await getAppointments()

      return response?.data || []
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
        'Unable to fetch appointments.'
      )
    }
  }
)

export const approveAppointments =
  createAsyncThunk(
    'appointments/approve',

    async (id, { rejectWithValue }) => {
      try {
        const response =
          await approveAppointment(id)

        return {
          id,
          message:
            response?.data ||
            'Appointment approved successfully.'
        }
      } catch (error) {
        return rejectWithValue(
          error.response?.data ||
          'Unable to approve appointment.'
        )
      }
    }
  )

export const cancelAppointments =
  createAsyncThunk(
    'appointments/cancel',

    async (id, { rejectWithValue }) => {
      try {
        const response =
          await cancelAppointment(id)

        return {
          id,
          message:
            response?.data ||
            'Appointment cancelled successfully.'
        }
      } catch (error) {
        return rejectWithValue(
          error.response?.data ||
          'Unable to cancel appointment.'
        )
      }
    }
  )

const appointmentSlice = createSlice({
  name: 'appointments',

  initialState: {
    items: [],
    loading: false,
    error: null
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(
        loginSuccess,
        (state) => {
          state.items = []
          state.loading = false
          state.error = null
        }
      )

      .addCase(
        logout,
        (state) => {
          state.items = []
          state.loading = false
          state.error = null
        }
      )

      .addCase(
        fetchAppointments.pending,
        (state) => {
          state.loading = true
          state.error = null
        }
      )

      .addCase(
        fetchAppointments.fulfilled,
        (state, action) => {
          state.loading = false
          state.error = null

          state.items =
            Array.isArray(action.payload)
              ? action.payload
              : []
        }
      )

      .addCase(
        fetchAppointments.rejected,
        (state, action) => {
          state.loading = false
          state.items = []

          state.error =
            action.payload ||
            'Unable to fetch appointments.'
        }
      )

      .addCase(
        approveAppointments.fulfilled,
        (state, action) => {
          const appointment =
            state.items.find(
              (item) =>
                item.id === action.payload.id
            )

          if (appointment) {
            appointment.status = 'APPROVED'
          }

          state.error = null
        }
      )

      .addCase(
        approveAppointments.rejected,
        (state, action) => {
          state.error =
            action.payload ||
            'Unable to approve appointment.'
        }
      )

      .addCase(
        cancelAppointments.fulfilled,
        (state, action) => {
          const appointment =
            state.items.find(
              (item) =>
                item.id === action.payload.id
            )

          if (appointment) {
            appointment.status = 'CANCELLED'
          }

          state.error = null
        }
      )

      .addCase(
        cancelAppointments.rejected,
        (state, action) => {
          state.error =
            action.payload ||
            'Unable to cancel appointment.'
        }
      )
  }
})

export default appointmentSlice.reducer
