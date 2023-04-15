import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    classes: [],
    classesByShift: [],
};

export const classesSlice = createSlice({
    name: "classes",
    initialState: initialState,
    reducers: {
        addClasses: (state, action) => {
            state.classes = action.payload.classes;
        },
        addClassesByShift: (state, action) => {
            state.classesByShift = action.payload.classes;
        }
    },
});

export const { addClasses, addClassesByShift } = classesSlice.actions;

export default classesSlice.reducer;
