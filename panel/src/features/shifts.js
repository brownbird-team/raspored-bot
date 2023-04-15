import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    shifts: [],
};

export const shiftSlice = createSlice({
    name: "shift",
    initialState: initialState,
    reducers: {
		addShifts: (state, action) => {
			state.shifts = action.payload.shifts;
		}
	},
});

export const { addShifts } = shiftSlice.actions;

export default shiftSlice.reducer;