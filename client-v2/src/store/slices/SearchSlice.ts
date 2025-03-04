import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// async search
export const searchArticlesAsync = createAsyncThunk('search/searchArticles', async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    return response.data;
});

// search state
interface SearchState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    users: any[];
    error: string | undefined;
}

const initialState: SearchState = {
    status: 'idle',
    users: [],
    error: undefined
};

const SearchSlice = createSlice({
    name: 'search',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(searchArticlesAsync.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(searchArticlesAsync.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.users = action.payload;
          })
          .addCase(searchArticlesAsync.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          });
    }
});

export default SearchSlice;