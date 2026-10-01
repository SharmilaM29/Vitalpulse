import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit'

import {
  getPatients,
  getMyPatients,
  deletePatient,
  enrollPatient,
  updatePatient
} from '../../services/patientService'

import {
  loginSuccess,
  logout
} from './authSlice'

export const fetchPatients = createAsyncThunk(
  'patients/fetchAll',

  async (_, { rejectWithValue }) => {

    try {

      const response = await getPatients()

      console.log(
        'GET /patients/ RESPONSE:',
        response.data
      )

      if (Array.isArray(response.data)) {
        return response.data
      }

      if (
        Array.isArray(response.data?.patients)
      ) {
        return response.data.patients
      }

      if (
        Array.isArray(response.data?.content)
      ) {
        return response.data.content
      }

      return []

    } catch (error) {

      console.log(
        'GET /patients/ ERROR:',
        error.response?.data
      )

      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data ||
        'Failed to fetch patients'
      )
    }
  }
)

export const fetchMyPatients = createAsyncThunk(
  'patients/fetchMyPatients',

  async (_, { rejectWithValue }) => {

    try {

      const response = await getMyPatients()

      console.log(
        'GET /patients/my-patients/ RESPONSE:',
        response.data
      )

      if (Array.isArray(response.data)) {
        return response.data
      }

      if (
        Array.isArray(response.data?.patients)
      ) {
        return response.data.patients
      }

      if (
        Array.isArray(response.data?.content)
      ) {
        return response.data.content
      }

      return []

    } catch (error) {

      console.log(
        'GET /patients/my-patients/ ERROR:',
        error.response?.data
      )

      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data ||
        'Failed to fetch assigned patients'
      )
    }
  }
)

export const addPatient = createAsyncThunk(
  'patients/add',

  async (data, { rejectWithValue }) => {

    try {

      const response =
        await enrollPatient(data)

      return response.data

    } catch (error) {

      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to add patient'
      )
    }
  }
)

export const editPatient = createAsyncThunk(
  'patients/update',

  async (
    { id, data },
    { rejectWithValue }
  ) => {

    try {

      const response =
        await updatePatient(id, data)

      return {
        id,
        data: response.data
      }

    } catch (error) {

      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to update patient'
      )
    }
  }
)

export const removePatient = createAsyncThunk(
  'patients/remove',

  async (
    id,
    { rejectWithValue }
  ) => {

    try {

      await deletePatient(id)

      return id

    } catch (error) {

      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to delete patient'
      )
    }
  }
)

const patientSlice = createSlice({

  name: 'patients',

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
        fetchPatients.pending,
        (state) => {

          state.loading = true
          state.error = null
        }
      )

      .addCase(
        fetchPatients.fulfilled,
        (state, action) => {

          state.loading = false

          state.items =
            Array.isArray(action.payload)
              ? action.payload
              : []

          console.log(
            'ALL PATIENTS STORED:',
            state.items
          )
        }
      )

      .addCase(
        fetchPatients.rejected,
        (state, action) => {

          state.loading = false
          state.items = []

          state.error =
            action.payload ||
            'Failed to fetch patients'
        }
      )

      .addCase(
        fetchMyPatients.pending,
        (state) => {

          state.loading = true
          state.error = null
        }
      )

      .addCase(
        fetchMyPatients.fulfilled,
        (state, action) => {

          state.loading = false

          state.items =
            Array.isArray(action.payload)
              ? action.payload
              : []

          console.log(
            'MY PATIENTS STORED:',
            state.items
          )
        }
      )

      .addCase(
        fetchMyPatients.rejected,
        (state, action) => {

          state.loading = false
          state.items = []

          state.error =
            action.payload ||
            'Failed to fetch assigned patients'
        }
      )

      .addCase(
        addPatient.pending,
        (state) => {

          state.loading = true
          state.error = null
        }
      )

      .addCase(
        addPatient.fulfilled,
        (state) => {

          state.loading = false
        }
      )

      .addCase(
        addPatient.rejected,
        (state, action) => {

          state.loading = false
          state.error = action.payload
        }
      )

      .addCase(
        editPatient.pending,
        (state) => {

          state.loading = true
          state.error = null
        }
      )

      .addCase(
        editPatient.fulfilled,
        (state) => {

          state.loading = false
        }
      )

      .addCase(
        editPatient.rejected,
        (state, action) => {

          state.loading = false
          state.error = action.payload
        }
      )

      .addCase(
        removePatient.pending,
        (state) => {

          state.loading = true
          state.error = null
        }
      )

      .addCase(
        removePatient.fulfilled,
        (state, action) => {

          state.loading = false

          state.items =
            state.items.filter(
              (patient) =>
                patient.id !== action.payload
            )
        }
      )

      .addCase(
        removePatient.rejected,
        (state, action) => {

          state.loading = false
          state.error = action.payload
        }
      )
  }
})

export default patientSlice.reducer