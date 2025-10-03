import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from '../../utils/httpClient';
import SearchState from './SearchState';
import Sample from '../../types/Sample';
import { RootState } from '../store';

// Define the delay function
const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms));

// async search total samples
export const getTotalSamplesAsync = createAsyncThunk<number>('search/getTotalSamples', async () => {
  const response = await HttpClient.get(`./api/countSamples`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });
  return response.data?.value[0]?.total_sample_count;
});

// async list all samples
export const getAllSamplesAsync = createAsyncThunk<Sample[]>('search/getAllSamplesAsync', async () => {
  const response = await HttpClient.get(`./api/samples`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });
  return response.data.value;
});

// async list latest samples
export const getLatestSamplesAsync = createAsyncThunk<Sample[]>('search/getLatestSamples', async () => {
  const response = await HttpClient.get(`./api/latestSamples`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });
  return response.data?.value;
});

// async search specific samples
export const searchSamplesAsync = createAsyncThunk<Sample[], string>('search/searchSamplesAsync', async (query: string) => {
  const response = await HttpClient.get(`./api/findSamples?text=${query}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });
  return response.data.value;
});

// delete a sample
export const deleteSampleAsync = createAsyncThunk<number, string, { state: RootState }>('search/deleteSampleAsync', async (id: string, { getState }) => {
  const state = getState();
  const isAdmin = state.user.isAdmin;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (isAdmin) {
    headers['X-MS-API-ROLE'] = 'admin';
  }

  await delay(1000).then(async () => { // for better user experience
    await HttpClient.delete(`./api/deleteSample`, {
      data: { id: id, url: null },
      headers
    });

  });
  return Number(id);
});

// get the details
export const getSampleDetailsAsync = createAsyncThunk<Sample, string>('search/getSampleDetailsAsync', async (id: string) => {
  const response = await HttpClient.post(`./api/sampleDetails`, { id: id, url: null }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });
  const sample = response.data.value[0].sample_json;
  return JSON.parse(sample);
});

// upsert a sample (create or update)
export const upsertSampleAsync = createAsyncThunk<
  { id: number; isCreate: boolean }, 
  { payload: string; isCreate: boolean },
  { state: RootState }
>('search/upsertSampleAsync', async ({ payload, isCreate }, { getState }) => {
  const state = getState();
  const isAdmin = state.user.isAdmin;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (isAdmin) {
    headers['X-MS-API-ROLE'] = 'admin';
  }

  const response = await HttpClient.post(`./api/upsertSample`, { payload: payload }, {
    headers
  });
  return { id: response.data, isCreate };
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
  upsertSample: {
    status: 'idle',
    error: undefined,
    id: 0,
    isCreate: false
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
    },
    resetUpsertState: (state) => {
      state.upsertSample = initialState.upsertSample;
    },
    resetSampleDetailsState: (state) => {
      state.sampleDetails = initialState.sampleDetails;
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
      // upsert sample (create or update)
      .addCase(upsertSampleAsync.pending, (state) => {
        state.upsertSample.status = 'loading';
      })
      .addCase(upsertSampleAsync.fulfilled, (state, action) => {
        state.upsertSample.status = 'succeeded';
        state.upsertSample.id = action.payload.id;
        state.upsertSample.isCreate = action.payload.isCreate;
        // increment total samples count only if it's a create operation
        if (action.payload.isCreate) {
          state.totalSamples.total = state.totalSamples.total + 1;
        }
      })
      .addCase(upsertSampleAsync.rejected, (state, action) => {
        state.upsertSample.status = 'failed';
        state.upsertSample.error = action.error.message;
      })
      ;
  }
});

export const { resetSearchState, resetDeleteState, resetUpsertState, resetSampleDetailsState } = SearchSlice.actions;

// Backward compatibility exports
export const createSampleAsync = (payload: string) => upsertSampleAsync({ payload, isCreate: true });
export const updateSampleAsync = (payload: string) => upsertSampleAsync({ payload, isCreate: false });
export const resetCreateState = resetUpsertState;
export const resetUpdateState = resetUpsertState;

export default SearchSlice;