import { createSlice } from "@reduxjs/toolkit";
import weeks from "../__tests__/weeks.json";

const initialState = {
    value: weeks,
    weeksOrder: [],
};

export const weeksSlice = createSlice({
    name: "weeks",
    initialState: initialState,
    reducers: {
        saveWeeksOrder: (state, action) => {
            state.weeksOrder = action.payload;
        },
    },
});

export const { saveWeeksOrder } = weeksSlice.actions;

export default weeksSlice.reducer;
