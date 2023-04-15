import { createSlice } from "@reduxjs/toolkit";
import periods from "../__tests__/periods.json";

const initialState = {
    value: periods,
};

export const periodsSlice = createSlice({
    name: "periods",
    initialState: initialState,
    reducers: { },
});

/* export const { } = periodsSlice.actions; */

export default periodsSlice.reducer;
