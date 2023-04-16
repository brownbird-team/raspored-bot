import { createSlice } from "@reduxjs/toolkit";

const getLogin = () => {
    if (localStorage.hasOwnProperty("token")) {
		const token = localStorage.getItem("token");
		return token;
	}
    return false;
};

const initialState = {
    token: getLogin(),
	username: null,
};

export const loginSlice = createSlice({
    name: "login",
    initialState: initialState,
    reducers: {
		saveLoginData: (state, action) => {
			state.token = action.payload.token;
			state.username = action.payload.username;
			localStorage.setItem("token", action.payload.token);
		},
		removeLoginData: (state) => {
			state.token = null;
			state.username = null;
			localStorage.setItem("token", null);
		}
    },
});

export const { saveLoginData, removeLoginData } = loginSlice.actions;

export default loginSlice.reducer;