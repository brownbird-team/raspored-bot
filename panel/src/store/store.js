import { configureStore } from "@reduxjs/toolkit";
import ClassFilterReducer from "../features/ClassFilter";

export const store = configureStore({
    reducer: { ClassFilter: ClassFilterReducer },
});
