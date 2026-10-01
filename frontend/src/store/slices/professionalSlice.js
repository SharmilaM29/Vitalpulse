import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchProfessionals = createAsyncThunk(
  'professionals/fetchAll',

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/professionals/')

      console.log('Professionals API response:', response.data)
      console.log('Response type:', typeof response.data)

      let data = response.data

      // If the backend returns JSON as a string,
      // convert it into a JavaScript object/array.
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch (error) {
          console.error('JSON parsing failed:', error)

          return rejectWithValue(
            'Unable to read professionals data from server.'
          )
        }
      }

      // Make sure we finally have an array
      if (!Array.isArray(data)) {
        console.error('Expected array but received:', data)

        return rejectWithValue(
          'Invalid professionals data received from server.'
        )
      }

      console.log('Final professionals data:', data)

      return data

    } catch (error) {
      console.error(
        'Fetch professionals error:',
        error.response?.data || error
      )

      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        'Unable to fetch medical professionals.'
      )
    }
  }
)

const professionalSlice = createSlice({
  name: 'professionals',

  initialState: {
    items: [],
    loading: false,
    error: null
  },

  reducers: {},

  extraReducers: (builder) => {

    builder.addCase(
      fetchProfessionals.pending,
      (state) => {
        state.loading = true
        state.error = null
      }
    )

    builder.addCase(
      fetchProfessionals.fulfilled,
      (state, action) => {
        state.loading = false
        state.error = null
        state.items = action.payload
      }
    )

    builder.addCase(
      fetchProfessionals.rejected,
      (state, action) => {
        state.loading = false
        state.items = []
        state.error =
          action.payload ||
          'Unable to fetch medical professionals.'
      }
    )
  }
})

export default professionalSlice.reducer
