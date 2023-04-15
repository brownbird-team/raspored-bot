import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: false,
};

export const leftSidebarSlice = createSlice({
    name: "leftSidebar",
    initialState: initialState,
    reducers: {
		setOpen: (state) => {
			state.value = true;
		},
		setClose: (state) => {
			state.value = false;
		}
    },
});

export const { setOpen, setClose } = leftSidebarSlice.actions;

export default leftSidebarSlice.reducer;