import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [],
};

export const usersSlice = createSlice({
    name: "users",
    initialState: initialState,
    reducers: {
		addUsers: (state, action) => {
			state.users = action.payload;
		}
	},
});

export const { addUsers } = usersSlice.actions;

export default usersSlice.reducer;