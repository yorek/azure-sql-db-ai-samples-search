import { createSlice } from "@reduxjs/toolkit";
import UserState from "./userState";
import { teamsDarkTheme, teamsLightTheme } from "@fluentui/react-components";
import sha256 from "crypto-js/sha256";

// initial state
const initialState: UserState = {
    fullName: "",
    email: "",
    emailHash: "",
    token: "",
    role: "",
    isAuth: false,
    theme: teamsLightTheme
};

// Read state from cookie if available
const cookieState = localStorage.getItem("userState");
const parsedCookieState = cookieState ? JSON.parse(cookieState) : null;

export const userSlice = createSlice({
    name: "user",
    initialState: parsedCookieState || initialState,
    reducers: {
        login: (state) => {
            state.fullName = "Raffaele Garofalo";
            state.email = "rgarofalo@microsoft.com";
            state.emailHash = sha256("rgarofalo@microsoft.com").toString();
            state.role = "Microsoft";
            state.isAuth = true;
            localStorage.setItem("userState", JSON.stringify(state));
        },
        logout: (state) => {
            localStorage.removeItem("userState");
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
            localStorage.setItem("userState", JSON.stringify(state));
        }
    }
});

export const { login, logout, setTheme } = userSlice.actions;

export default userSlice;
