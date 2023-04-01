import { createSlice } from "@reduxjs/toolkit";
import { classesSlice } from "./classes";

const initialState = {
    value: [{ filterName: "default", values: classesSlice.getInitialState().value }],
};

export const classFilterSlice = createSlice({
    name: "classFilter",
    initialState: initialState,
    reducers: {
        setClassFilter: (state, action) => {
            state.value.push(action.payload);
        },
        removeClassFilter: (state, action) => {
            const newFilters = state.value.filter(({ filterName }) => filterName !== action.payload);
            state.value = newFilters;
        },
    },
});

export const { setClassFilter, removeClassFilter } = classFilterSlice.actions;

export default classFilterSlice.reducer;
