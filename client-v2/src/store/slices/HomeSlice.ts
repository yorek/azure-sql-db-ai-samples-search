import HomeState from "./HomeState";
import { createSlice } from '@reduxjs/toolkit';

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