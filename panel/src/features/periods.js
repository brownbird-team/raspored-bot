import { createSlice } from "@reduxjs/toolkit";
import { generateId } from "../services/generateId";
import periods from "../__tests__/periods.json";

const initialState = {
    value: periods,
    filters: [
        { filterName: "default", periods: periods, uniqueId: generateId() },
        { filterName: "prijepodne", periods: [
            { "id": 1, "name": "1", "startTime": "07:30:00", "endTime": "08:15:00" },
            { "id": 2, "name": "2", "startTime": "08:20:00", "endTime": "09:05:00" },
            { "id": 3, "name": "3", "startTime": "09:10:00", "endTime": "09:55:00" },
            { "id": 4, "name": "4", "startTime": "10:15:00", "endTime": "11:00:00" },
            { "id": 5, "name": "5", "startTime": "11:05:00", "endTime": "11:50:00" },
            { "id": 6, "name": "6", "startTime": "11:55:00", "endTime": "12:40:00" },
            { "id": 7, "name": "7", "startTime": "12:45:00", "endTime": "13:30:00" }], uniqueId: "prijepodne"
        }
    ],
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
