import { createSlice } from "@reduxjs/toolkit";
import { generateId } from "../services/generateId";
import periods from "../__tests__/periods.json";

const initialState = {
    value: periods,
    filters: [{ filterName: "default", periods: periods, uniqueId: generateId() }],
};

export const periodsSlice = createSlice({
    name: "periods",
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

export const { addPeriodFilter, updatePeriodFilter, removePeriodFilter } = periodsSlice.actions;

export default periodsSlice.reducer;
