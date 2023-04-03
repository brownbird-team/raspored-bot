import { configureStore } from "@reduxjs/toolkit";
import classFilterReducer from "../features/classFilter";
import classesReducer from "../features/classes";
import periodsReducer from "../features/periods";

export const store = configureStore({
    reducer: {
        classFilter: classFilterReducer,
        classes: classesReducer,
        periods: periodsReducer,
    },
});
