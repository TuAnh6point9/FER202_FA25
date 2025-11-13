import { configureStore } from "@reduxjs/toolkit";
import expensesReducer from "./expenseSlice";

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
  },
});
