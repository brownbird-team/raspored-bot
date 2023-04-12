import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	changes: [],
};

export const changesSlice = createSlice({
    name: "changes",
    initialState: initialState,
    reducers: {
		addChange: (state, action) => {
			state.changes.push(action.payload);
		}
    },
});

export const { addChange } = changesSlice.actions;

export default changesSlice.reducer;