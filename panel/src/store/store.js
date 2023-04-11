import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme";
import classesReducer from "../features/classes";
import periodsReducer from "../features/periods";
import weeksReducer from "../features/weeks";

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        classes: classesReducer,
        periods: periodsReducer,
        weeks: weeksReducer,
    },
});
