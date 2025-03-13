import HomeState from "./HomeState";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// async search total samples
export const getTotalSamplesAsync = createAsyncThunk<number>('home/getTotalSamples', async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}countSamples`, {
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });   
    return response.data?.value[0]?.total_sample_count;
});

const initialState: HomeState = {
    totalSamples: {
        status: 'idle',
        error: undefined,
        total: 0
    }
};

const HomeSlice = createSlice({
    name: 'home',
    initialState: initialState,
    reducers: { },
    extraReducers: (builder) => {
        builder
        // total samples
        .addCase(getTotalSamplesAsync.pending, (state) => {
            state.totalSamples.status = 'loading';
          })
          .addCase(getTotalSamplesAsync.fulfilled, (state, action) => {
            state.totalSamples.status = 'succeeded';
            state.totalSamples.total = action.payload;
          })
          .addCase(getTotalSamplesAsync.rejected, (state, action) => {
            state.totalSamples.status = 'failed';
            state.totalSamples.error = action.error.message;            
          });
    }
});

export default HomeSlice;