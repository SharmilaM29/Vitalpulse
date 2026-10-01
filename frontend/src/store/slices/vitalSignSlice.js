import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {deleteVital, getVitals, logVital} from '../../services/vitalSignService';

export const fetchVitals = createAsyncThunk('vitals/fetchAll', async(_, {rejectWithValue})=>{
  try{
    const response = await getVitals();
    return response.data;
  }
  catch(error){
    return rejectWithValue(error.response?.data || 'Failed to fetch vital signs')
  }

})

export const addVital=createAsyncThunk('vitals/add', async(data, {rejectWithValue})=>{
  try{
    const response = await logVital(data);
    return response.data;
  }
  catch(error){
    return rejectWithValue(error.response?.data || 'Failed to record vital signs')
  }
})

export const removeVitals=createAsyncThunk('vitals/remove', async(id, {rejectWithValue})=>{
  try{
    await deleteVital(id);
    return id;
  }
  catch(error){
    return rejectWithValue(error.response?.data || 'Failed to delete vital signs')
  }
})

const vitalSignSlice=createSlice({
  name: 'vitals',
  initialState: {items:[], loading: false, error: null},
  reducers: {},
  extraReducers: (builder)=>{
    builder
          .addCase(fetchVitals.pending, (state)=>{state.loading=true; state.error=null;})
          .addCase(fetchVitals.fulfilled, (state, action)=>{
            state.loading=false;
            state.items=action.payload;
          })
          .addCase(fetchVitals.rejected, (state, action)=>{state.loading=false; state.error=action.payload;})
          .addCase(addVital.pending, (state)=>{state.loading=true; state.error=null;})
          .addCase(addVital.fulfilled, (state, action)=>{
            state.loading=false;
            if (action.payload){
              state.items.push(action.payload);
            }
          })
          .addCase(addVital.rejected, (state, action)=>{state.loading=false; state.error=action.payload;})
          .addCase(removeVitals.fulfilled, (state, action)=>{state.loading=false; state.items=state.items.filter((v)=> v.id!==action.payload);})
          .addCase(removeVitals.rejected, (state, action)=>{state.loading=false; state.error=action.payload;})
  }
})

export default vitalSignSlice.reducer
