import { createSlice } from "@reduxjs/toolkit";
import UserState from "./UserState";
import sha256 from "crypto-js/sha256";

// initial state
const initialState: UserState = {
    fullName: "",
    email: "",
    emailHash: "",
    token: "",
    role: "",
    isAuth: false,
    theme: "light"
};

// Read state from cookie if available
const cookieState = localStorage.getItem("userState");
const parsedCookieState = cookieState ? JSON.parse(cookieState) : null;

export const UserSlice = createSlice({
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
                state.theme = "dark";
            }
            else {
                state.theme = "light";
            }
            localStorage.setItem("userState", JSON.stringify(state));
        }
    }
});

export const { login, logout, setTheme } = UserSlice.actions;

export default UserSlice;
