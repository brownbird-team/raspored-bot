import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	changes: [],
    changeId: null,
    changeMorning: null,
    changeShift: null,
    changeEdit: [],
};

export const changesSlice = createSlice({
    name: "changes",
    initialState: initialState,
    reducers: {
        addChanges: (state, action) => {
            state.changes = action.payload.changes;
        },
        setChangeId: (state, action) => {
            state.changeId = action.payload;
        },
        setChangeMorningAndShift: (state, action) => {
            state.changeMorning = action.payload.morning;
            state.changeShift = action.payload.shift;
        },
        setChangeEdit: (state, action) => {
            state.changeEdit = action.payload;
        }
    },
});

export const { addChanges, setChangeId, setChangeMorningAndShift, setChangeEdit } = changesSlice.actions;

export default changesSlice.reducer;