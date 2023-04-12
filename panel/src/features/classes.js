import { createSlice } from "@reduxjs/toolkit";
import { generateId } from "../services/generateId";
import classes from "../__tests__/classes.json";

const initialState = {
    value: classes,
    filters: [
        { filterName: "default", classes: classes, uniqueId: generateId() },
        { filterName: "b-smjena", classes: [
            { "id": 21, "label": "1.E" },
            { "id": 22, "label": "1.F" },
            { "id": 23, "label": "1.G" },
            { "id": 24, "label": "1.M" },
            { "id": 25, "label": "1.N" },
            { "id": 26, "label": "2.E" },
            { "id": 27, "label": "2.F" },
            { "id": 28, "label": "2.G" },
            { "id": 29, "label": "2.M" },
            { "id": 30, "label": "2.N" },
            { "id": 31, "label": "3.E" },
            { "id": 32, "label": "3.F" },
            { "id": 33, "label": "3.G" },
            { "id": 34, "label": "3.M" },
            { "id": 35, "label": "3.N" },
            { "id": 36, "label": "4.E" },
            { "id": 37, "label": "4.F" },
            { "id": 38, "label": "4.G" },
            { "id": 39, "label": "4.M" },
            { "id": 40, "label": "4.N" }
        ], uniqueId: "b-smjena"}
    ],
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
