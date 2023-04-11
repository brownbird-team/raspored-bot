import { createSlice } from "@reduxjs/toolkit";
import days from "../__tests__/days.json";

const initialState = {
    value: days,
};

export const daysSlice = createSlice({
    name: "days",
    initialState: initialState,
    reducers: {
        saveDaysOfWeek: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { saveDaysOfWeek } = daysSlice.actions;

export default daysSlice.reducer;
