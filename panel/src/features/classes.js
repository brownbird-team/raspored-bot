import { createSlice } from "@reduxjs/toolkit";
import classes from "../__tests__/classes.json";

const initialState = {
    value: classes,
};

export const classesSlice = createSlice({
    name: "classes",
    initialState: initialState,
    reducers: {},
});

export default classesSlice.reducer;
