import { createSlice } from "@reduxjs/toolkit";
import { generateId } from "../services/generateId";
import classes from "../__tests__/classes.json";

const initialState = {
    value: classes,
    filters: [{ filterName: "default", classes: classes, uniqueId: generateId() }],
};

export const classesSlice = createSlice({
    name: "classes",
    initialState: initialState,
    reducers: {
        addClassFilter: (state, action) => {
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

export const { addClassFilter, updateClassFilter, removeClassFilter } = classesSlice.actions;

export default classesSlice.reducer;
