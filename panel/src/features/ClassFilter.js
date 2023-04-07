import { createSlice } from "@reduxjs/toolkit";
import { classesSlice } from "./classes";
import { generateId } from "../services/generateId";

const initialState = {
    filters: [{ filterName: "default", classes: classesSlice.getInitialState().value, uniqueId: generateId() }],
};

export const classFilterSlice = createSlice({
    name: "classFilter",
    initialState: initialState,
    reducers: {
        setClassFilter: (state, action) => {
            state.filters.push({ ...action.payload, uniqueId: generateId() });
        },
        updateClassFilter: (state, action) => {
            const targetFilter = state.filters.find(({ uniqueId }) => uniqueId === action.payload.uniqueId);
            if (targetFilter) {
                targetFilter.filterName = action.payload.filterName;
                targetFilter.classes = action.payload.classes;
            }
        },
        removeClassFilter: (state, action) => {
            state.filters = state.filters.filter(({ filterName }) => filterName !== action.payload);
        },
    },
});

export const { setClassFilter, updateClassFilter, removeClassFilter } = classFilterSlice.actions;

export default classFilterSlice.reducer;
