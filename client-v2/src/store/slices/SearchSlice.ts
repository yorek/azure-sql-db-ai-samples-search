import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from '../../utils/httpClient';
import SearchState from './SearchState';
import Sample from '../../types/Sample';

// Define the delay function
const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms));

// async search total samples
export const getTotalSamplesAsync = createAsyncThunk<number>('search/getTotalSamples', async () => {
  const response = await HttpClient.get(`${import.meta.env.VITE_API_URL}countSamples`, {
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });
  return response.data?.value[0]?.total_sample_count;
});

// async list all samples
export const getAllSamplesAsync = createAsyncThunk<Sample[]>('search/getAllSamplesAsync', async () => {
  const response = await HttpClient.get(`${import.meta.env.VITE_API_URL}samples`, {
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
  const response = await HttpClient.get(`${import.meta.env.VITE_API_URL}latestSamples`, {
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
  const response = await HttpClient.get(`${import.meta.env.VITE_API_URL}findSamples?text=${query}`, {
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
  await delay(1000).then(async () => { // for better user experience
    await HttpClient.delete(`${import.meta.env.VITE_API_URL}deleteSample`, {
      data: { id: id, url: null },
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

  });
  return Number(id);
});

// get the details
export const getSampleDetailsAsync = createAsyncThunk<Sample, string>('search/getSampleDetailsAsync', async (id: string) => {
  const response = await HttpClient.post(`${import.meta.env.VITE_API_URL}sampleDetails`, { id: id, url: null }, {
    // withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });
  const sample = response.data.value[0].sample_json;
  return JSON.parse(sample);
});

// create a sample
export const createSampleAsync = createAsyncThunk<number, string>('search/createSampleAsync', async (payload: string) => {
  const response = await HttpClient.post(`${import.meta.env.VITE_API_URL}createSample`, { payload: payload }, {
    // withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });
  return response.data;
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
  },
  totalSamples: {
    status: 'idle',
    error: undefined,
    total: 0
  },
  sampleDetails: {
    status: 'idle',
    error: undefined,
    sample: undefined
  },
  createSample: {
    status: 'idle', 
    error: undefined,
    id: 0
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
        // recount the total samples
        state.totalSamples.total = state.totalSamples.total - 1;

      })
      .addCase(deleteSampleAsync.rejected, (state, action) => {
        state.delete.status = 'failed';
        state.delete.error = action.error.message;
      })
      // get sample details
      .addCase(getSampleDetailsAsync.pending, (state) => {
        state.sampleDetails.status = 'loading';
      })
      .addCase(getSampleDetailsAsync.fulfilled, (state, action) => {
        state.sampleDetails.status = 'succeeded';
        state.sampleDetails.sample = action.payload;
      })
      .addCase(getSampleDetailsAsync.rejected, (state, action) => {
        state.sampleDetails.status = 'failed';
        state.sampleDetails.error = action.error.message;
      })
      // create sample
      .addCase(createSampleAsync.pending, (state) => {
        state.createSample.status = 'loading'
      })
      .addCase(createSampleAsync.fulfilled, (state, action) => {
        state.createSample.status = 'succeeded';
        state.createSample.id = action.payload;
        // recount the total samples
        state.totalSamples.total = state.totalSamples.total + 1;
      })
      .addCase(createSampleAsync.rejected, (state, action) => {
        state.createSample.status = 'failed';
        state.createSample.error = action.error.message;
      })
      ;
  }
});

export const { resetSearchState, resetDeleteState } = SearchSlice.actions;
export default SearchSlice;