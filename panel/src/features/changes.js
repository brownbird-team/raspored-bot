import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	changes: [],
    changeId: null
};

export const changesSlice = createSlice({
    name: "changes",
    initialState: initialState,
    reducers: {
        setChangeId: (state, action) => {
            state.changeId = action.payload.newChangeId;
        }
    },
});

export const { setChangeId } = changesSlice.actions;

export default changesSlice.reducer;