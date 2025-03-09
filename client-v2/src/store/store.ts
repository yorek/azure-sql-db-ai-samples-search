import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import UserSlice from "./slices/UserSlice";
import SearchSlice from "./slices/SearchSlice";
import HomeSlice from "./slices/HomeSlice";

const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    search: SearchSlice.reducer,
    home: HomeSlice.reducer
  },
  
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch.withTypes<AppDispatch>();

export default store;