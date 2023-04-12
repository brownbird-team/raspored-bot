import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	changes: [],
	changeActive: null,
};

export const changesSlice = createSlice({
    name: "changes",
    initialState: initialState,
    reducers: {
		addChange: (state, action) => {
			state.changes.push(action.payload);
		},
		setActiveChange: (state, action) => {
			state.changeActive = action.payload;
		}
    },
});

export const { addChange, setActiveChange } = changesSlice.actions;

export default changesSlice.reducer;