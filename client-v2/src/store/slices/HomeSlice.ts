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
    status: 'idle',
    error: undefined,
    totalSamples: 0
};

const HomeSlice = createSlice({
    name: 'home',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getTotalSamplesAsync.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(getTotalSamplesAsync.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.totalSamples = action.payload;
          })
          .addCase(getTotalSamplesAsync.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
            console.error(action.error);
          });
    }
});

export default HomeSlice;