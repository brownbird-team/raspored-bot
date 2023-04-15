import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme";
import loginReducer from "../features/login";
import leftSidebarReducer from "../features/leftSidebar";
import classesReducer from "../features/classes";
import periodsReducer from "../features/periods";
import changeReducer from "../features/changes";
import shiftsReducer from "../features/shifts";

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        login: loginReducer,
        leftSidebar: leftSidebarReducer,
        classes: classesReducer,
        periods: periodsReducer,
        change: changeReducer,
        shifts: shiftsReducer,
    },
});
