import { createSlice } from "@reduxjs/toolkit";
import { periodsSlice } from "./periods";
import { generateId } from "../services/generateId";

const initialState = {
    filters: [{ filterName: "default", periods: periodsSlice.getInitialState().value, uniqueId: generateId() }],
};

export const periodFilterSlice = createSlice({
    name: "periodFilter",
    initialState: initialState,
    reducers: {
        addPeriodFilter: (state, action) => {
            state.filters.push({ ...action.payload, uniqueId: generateId() });
        },
        updatePeriodFilter: (state, action) => {
            const targetFilter = state.filters.find(({ uniqueId }) => uniqueId === action.payload.uniqueId);
            if (targetFilter) {
                targetFilter.filterName = action.payload.filterName;
                targetFilter.periods = action.payload.periods;
            }
        },
        removePeriodFilter: (state, action) => {
            state.filters = state.filters.filter(({ filterName }) => filterName !== action.payload);
        },
    },
});

export const { addPeriodFilter, updatePeriodFilter, removePeriodFilter } = periodFilterSlice.actions;

export default periodFilterSlice.reducer;
