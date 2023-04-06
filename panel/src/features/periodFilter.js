import { createSlice } from "@reduxjs/toolkit";
import { generateId } from "../services/generateId";

const initialState = {
    filters: [],
};

export const periodFilterSlice = createSlice({
    name: "periodFilter",
    initialState: initialState,
    reducers: {
        addPeriodFilter: (state, action) => {
            const newFilter = { ...action.payload, uniqueId: generateId() };
            state.filters.push(newFilter);
        },
    },
});

export const { addPeriodFilter } = periodFilterSlice.actions;

export default periodFilterSlice.reducer;
