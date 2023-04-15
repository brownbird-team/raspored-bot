import { createSlice } from "@reduxjs/toolkit";

const getLogin = () => {
    if (localStorage.hasOwnProperty("login")) {
		const login = localStorage.getItem("login");
		return login;
	}
    return false;
};

const initialState = {
    value: getLogin(),
};

export const loginSlice = createSlice({
    name: "login",
    initialState: initialState,
    reducers: {
		setLogin: (state) => {
			localStorage.setItem("login", "true");
			state.value = "true";
		},
		setLogout: (state) => {
			localStorage.setItem("login", "false");
			state.value = "false";
		}
    },
});

export const { setLogin, setLogout } = loginSlice.actions;

export default loginSlice.reducer;