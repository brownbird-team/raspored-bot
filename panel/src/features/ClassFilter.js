import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: null,
};

export const classFilterSlice = createSlice({
    name: "classFilter",
    initialState: initialState,
    reducers: {
        setClassFilter: (state, action) => {},
    },
});

export const { setClassFilter } = classFilterSlice.actions;

export default classFilterSlice.reducer;
