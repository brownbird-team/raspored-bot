import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	changes: [],
};

export const changesSlice = createSlice({
    name: "changes",
    initialState: initialState,
    reducers: {},
});

/* export const { } = changesSlice.actions; */

export default changesSlice.reducer;