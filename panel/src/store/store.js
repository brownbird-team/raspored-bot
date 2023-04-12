import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme";
import classesReducer from "../features/classes";
import periodsReducer from "../features/periods";
import daysReducer from "../features/days";
import weeksReducer from "../features/weeks";
import changeReducer from "../features/changes";

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        classes: classesReducer,
        periods: periodsReducer,
        days: daysReducer,
        weeks: weeksReducer,
        change: changeReducer,
    },
});
