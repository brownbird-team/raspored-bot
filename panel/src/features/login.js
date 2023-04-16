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
	userActive: { userId: null, username: null }
};

export const loginSlice = createSlice({
    name: "login",
    initialState: initialState,
    reducers: {
		saveLoginData: (state, action) => {
			const { token, userId, username} = action.payload;
			state.token = token;
			state.userActive = { userId: userId, username: username}
			localStorage.setItem("token", token);
		},
		removeLoginData: (state) => {
			state.token = null;
			state.userActive = initialState.userActive;
			localStorage.setItem("token", null);
		}
    },
});

export const { saveLoginData, removeLoginData } = loginSlice.actions;

export default loginSlice.reducer;