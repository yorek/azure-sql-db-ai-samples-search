import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import SearchState from './SearchState';
import Sample from '../../types/Sample';

// async list all samples
export const getAllSamplesAsync = createAsyncThunk<Sample[]>('home/getAllSamplesAsync', async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}samples`, {
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });   
  return response.data.value;
});


const initialState: SearchState = {
    samples: {
        status: 'idle',
        results: [],
        error: undefined
    }
};

const SearchSlice = createSlice({
    name: 'search',
    initialState: initialState,
    reducers: {
      resetSearchState: (state) => {
        state.samples = initialState.samples;
      }
    },
    extraReducers: (builder) => {
        builder
        // all samples
        .addCase(getAllSamplesAsync.pending, (state) => {
            state.samples.status = 'loading';
          })
          .addCase(getAllSamplesAsync.fulfilled, (state, action) => {
            state.samples.status = 'succeeded';
            state.samples.results = action.payload;
          })
          .addCase(getAllSamplesAsync.rejected, (state, action) => {
            state.samples.status = 'failed';
            state.samples.error = action.error.message;
          });
    }
});

export const { resetSearchState } = SearchSlice.actions;
export default SearchSlice;