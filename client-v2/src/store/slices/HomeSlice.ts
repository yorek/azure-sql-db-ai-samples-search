import HomeState from "./HomeState";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState: HomeState = {
};

const HomeSlice = createSlice({
    name: 'home',
    initialState: initialState,
    reducers: { },
    extraReducers: (builder) => {

    }
});

export default HomeSlice;