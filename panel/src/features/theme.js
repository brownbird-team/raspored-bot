import { createSlice } from "@reduxjs/toolkit";

const getTheme = () => {
    !localStorage.hasOwnProperty("theme") && localStorage.setItem("theme", "dark");
    const theme = localStorage.getItem("theme");
    return theme !== null ? theme : "";
};

const initialState = {
    value: getTheme(),
};

export const themeSlice = createSlice({
    name: "theme",
    initialState: initialState,
    reducers: {
        updateTheme: (state, action) => {
            localStorage.setItem("theme", action.payload);
            state.value = action.payload;
        },
    },
});

export const { updateTheme } = themeSlice.actions;

export default themeSlice.reducer;
