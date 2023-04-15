import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    classes: [],
};

export const classesSlice = createSlice({
    name: "classes",
    initialState: initialState,
    reducers: {
		addClasses: (state, action) => {
			state.classes = action.payload.classes;
		},
    },
});

export const { addClasses } = classesSlice.actions;

export default classesSlice.reducer;
