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
    },
});

export const { setClassFilter } = classFilterSlice.actions;

export default classFilterSlice.reducer;
