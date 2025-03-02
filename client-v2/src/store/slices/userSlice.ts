import { createSlice } from "@reduxjs/toolkit";
import UserState from "./userState";
import { teamsDarkTheme, teamsLightTheme } from "@fluentui/react-components";
import sha256 from "crypto-js/sha256";

const initialState: UserState = {
    fullName: "",
    email: "",
    emailHash: "",
    token: "",
    role: "",
    isAuth: false,
    theme: teamsLightTheme
};

export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        login: (state) => {
            state.fullName = "Raffaele Garofalo";
            state.email = "rgarofalo@microsoft.com";
            state.emailHash = sha256("rgarofalo@microsoft.com").toString();
            state.role = "Microsoft";
            state.isAuth = true;
        },
        logout: (state) => {
            return {
                ...state,
                ...initialState
            }
        },
        setTheme: (state, action) => {
            if (action.payload === "dark") {
                state.theme = teamsDarkTheme;
            }
            else {
                state.theme = teamsLightTheme;
            }
        }
    }
});

export const { login, logout, setTheme } = userSlice.actions;

export default userSlice.reducer;
