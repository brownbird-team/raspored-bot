import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme";

import classesReducer from "../features/classes";
import classFilterReducer from "../features/classFilter";

import periodsReducer from "../features/periods";
import periodsFilterReducer from "../features/periodFilter";

export const store = configureStore({
    reducer: {
        theme: themeReducer,

        classes: classesReducer,
        classFilter: classFilterReducer,

        periods: periodsReducer,
        periodFilter: periodsFilterReducer,
    },
});
