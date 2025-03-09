import HomeState from "./HomeState";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import LightSample from "../../types/LightSample";

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

// async latest samples
export const getLatestSamplesAsync = createAsyncThunk<LightSample[]>('home/getLatestSamples', async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}latestSamples`, {
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });   
  return response.data?.value;
});

// async search samples
export const searchSamplesAsync = createAsyncThunk<LightSample[], string>('home/searchSamplesAsync', async (query: string) => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}findSamples?text=${query}`, {
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });   
  return response.data.value;
});

const initialState: HomeState = {
    totalSamples: {
        status: 'idle',
        error: undefined,
        total: 0
    },
    latestSamples: {
        status: 'idle',
        errror: undefined,
        records: []
    }
};

const HomeSlice = createSlice({
    name: 'home',
    initialState: initialState,
    reducers: {
      resetHomeState: (state) => {
        state.latestSamples.status = 'idle';
        state.latestSamples.errror = undefined;
        state.latestSamples.records = [];
      }
    },
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
            
          })
          // latest samples
          .addCase(getLatestSamplesAsync.pending, (state) => {
            state.latestSamples.status = 'loading';
          })
          .addCase(getLatestSamplesAsync.fulfilled, (state, action) => {
            state.latestSamples.status = 'succeeded';
            state.latestSamples.records = action.payload;
          })
          .addCase(getLatestSamplesAsync.rejected, (state, action) => {
            state.latestSamples.status = 'failed';
            state.latestSamples.errror = action.error.message;
          })
          .addCase(searchSamplesAsync.pending, (state) => {
            state.latestSamples.status = 'loading';
          })
          .addCase(searchSamplesAsync.fulfilled, (state, action) => {
            state.latestSamples.status = 'succeeded';
            state.latestSamples.records = action.payload;
          })
          .addCase(searchSamplesAsync.rejected, (state, action) => {
            state.latestSamples.status = 'failed';
            state.latestSamples.errror = action.error.message;
          });
    }
});

export const { resetHomeState } = HomeSlice.actions;
export default HomeSlice;