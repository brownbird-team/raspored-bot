import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme";
import classFilterReducer from "../features/classFilter";
import classesReducer from "../features/classes";
import periodsReducer from "../features/periods";

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        classFilter: classFilterReducer,
        classes: classesReducer,
        periods: periodsReducer,
    },
});
