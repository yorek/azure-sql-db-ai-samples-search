import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import SearchState from './SearchState';
import Sample from '../../types/Sample';

// async list all samples
export const getAllSamplesAsync = createAsyncThunk<Sample[]>('search/getAllSamplesAsync', async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}samples`, {
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });   
  return response.data.value;
});

// async list latest samples
export const getLatestSamplesAsync = createAsyncThunk<Sample[]>('search/getLatestSamples', async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}latestSamples`, {
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });   
  return response.data?.value;
});

// async search specific samples
export const searchSamplesAsync = createAsyncThunk<Sample[], string>('search/searchSamplesAsync', async (query: string) => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}findSamples?text=${query}`, {
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });   
  return response.data.value;
});

// delete a sample
export const deleteSampleAsync = createAsyncThunk<number, string>('search/deleteSampleAsync', async (id: string) => {
  const response = await axios.delete(`${process.env.REACT_APP_API_URL}deleteSample`, {
    data: { id: id, url: null },
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });
  return Number(id);
});

const initialState: SearchState = {
    samples: {
        status: 'idle',
        results: [],
        error: undefined,
    },
    delete: {
      status: 'idle',
      error: undefined
    }  
};

const SearchSlice = createSlice({
    name: 'search',
    initialState: initialState,
    reducers: {
      resetSearchState: (state) => {
        state.samples = initialState.samples;
      },
      resetDeleteState: (state) => {
        state.delete = initialState.delete;
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
          })
          // latest samples
          .addCase(getLatestSamplesAsync.pending, (state) => {
            state.samples.status = 'loading';
          })
          .addCase(getLatestSamplesAsync.fulfilled, (state, action) => {
            state.samples.status = 'succeeded';
            state.samples.results = action.payload;
          })
          .addCase(getLatestSamplesAsync.rejected, (state, action) => {
            state.samples.status = 'failed';
            state.samples.error = action.error.message;
          })
          // search samples
          .addCase(searchSamplesAsync.pending, (state) => {
            state.samples.status = 'loading';
          })
          .addCase(searchSamplesAsync.fulfilled, (state, action) => {
            state.samples.status = 'succeeded';
            state.samples.results = action.payload;
          })
          .addCase(searchSamplesAsync.rejected, (state, action) => {  
            state.samples.status = 'failed';
            state.samples.error = action.error.message;
          })
          // delete sample
          .addCase(deleteSampleAsync.pending, (state) => {
            state.delete.status = 'loading';
          })
          .addCase(deleteSampleAsync.fulfilled, (state, action) => {
            state.delete.status = 'succeeded';
            // remove the deleted sample from the list
            state.samples.results = state.samples.results.filter(sample => sample.id !== action.payload);
            console.log(action);
          })
          .addCase(deleteSampleAsync.rejected, (state, action) => {
            state.delete.status = 'failed';
            state.delete.error = action.error.message;
          });
    }
});

export const { resetSearchState, resetDeleteState } = SearchSlice.actions;
export default SearchSlice;