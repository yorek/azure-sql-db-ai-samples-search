import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import SearchState from './SearchState';
import SearchResults from '../../types/SearchResults';

// delay for demo purposes
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// async search
export const searchArticlesAsync = createAsyncThunk<SearchResults, string>('search/searchArticles', async () => {
    await delay(2000);
    const response = await axios.get('https://jsonexamples.com/posts');
    return response.data;
});

const initialState: SearchState = {
    status: 'idle',
    results: undefined,
    error: undefined
};

const SearchSlice = createSlice({
    name: 'search',
    initialState: initialState,
    reducers: {
      resetSearchState: (state) => {
        state.status = 'idle';
        state.results = undefined;
        state.error = undefined;
      }
    },
    extraReducers: (builder) => {
        builder
        .addCase(searchArticlesAsync.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(searchArticlesAsync.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.results = action.payload;
          })
          .addCase(searchArticlesAsync.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          });
    }
});

export const { resetSearchState } = SearchSlice.actions;
export default SearchSlice;