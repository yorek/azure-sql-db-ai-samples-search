import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserState from "./UserState";
import sha256 from "crypto-js/sha256";
import { HttpClient } from "../../utils/httpClient";
import { User } from "../../types/User";
import { stat } from "fs";
import { isDataView } from "util/types";

// retrieve the current user and verify if it is authenticated
export const getUserAsync = createAsyncThunk<User>('user/getUserAsync', async () => {
    const response = await HttpClient.get(`/.auth/me`, {
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });   
    return response.data;
  });

// initial state
const initialState: UserState = {
    email: "",
    emailHash: "",
    userId: "",
    provider: "",
    roles: ["anonymous"],
    isAuth: false,
    isAdmin: false,
    theme: "light"
};

// // Read state from cookie if available
// const cookieState = localStorage.getItem("userState");
// const parsedCookieState = cookieState ? JSON.parse(cookieState) : null;

export const UserSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setTheme: (state, action) => {
            if (action.payload === "dark") {
                state.theme = "dark";
            }
            else {
                state.theme = "light";
            }
            localStorage.setItem("userState", JSON.stringify(state));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserAsync.fulfilled, (state, action) => {
                if (action.payload.clientPrincipal === null) {
                    state = initialState;
                    return;
                }
                state.email = action.payload.clientPrincipal.userDetails;
                state.emailHash = sha256(action.payload.clientPrincipal.userDetails).toString();
                state.provider = action.payload.clientPrincipal.identityProvider;
                state.roles = action.payload.clientPrincipal.userRoles;
                state.userId = action.payload.clientPrincipal.userId;
                state.isAuth = true;    
                state.isAdmin = state.roles.includes("admin");
                state.roles = state.roles.filter(role => role !== "anonymous");
                
            })
            .addCase(getUserAsync.rejected, (state) => {
                state.isAuth = false;
            })
            .addCase(getUserAsync.pending, (state) => {
                state.isAuth = false;
            });
    }
});

export const { setTheme } = UserSlice.actions;

export default UserSlice;
