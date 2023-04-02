import { createSlice } from "@reduxjs/toolkit";
import { classesSlice } from "./classes";

const generateUniqueId = (length = 8) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
};

const initialState = {
    filters: [{ filterName: "default", classes: classesSlice.getInitialState().value, uniqueId: generateUniqueId() }],
};

export const classFilterSlice = createSlice({
    name: "classFilter",
    initialState: initialState,
    reducers: {
        setClassFilter: (state, action) => {
            const newFilter = { ...action.payload, uniqueId: generateUniqueId() };
            state.filters.push(newFilter);
        },
        updateClassFilter: (state, action) => {
            const targetFilter = state.filters.find(({ uniqueId }) => uniqueId === action.payload.uniqueId);
            if (targetFilter) {
                targetFilter.filterName = action.payload.filterName;
                targetFilter.classes = action.payload.classes;
            }
        },
        removeClassFilter: (state, action) => {
            const newFilters = state.filters.filter(({ filterName }) => filterName !== action.payload);
            state.filters = newFilters;
        },
    },
});

export const { setClassFilter, updateClassFilter, removeClassFilter } = classFilterSlice.actions;

export default classFilterSlice.reducer;
