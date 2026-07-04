import { configureStore } from "@reduxjs/toolkit";
import { tasksSlice } from "./slices/tasksSlice";
import { filtersSlice } from "./slices/filtersSlice";

export const tasksStore = () => {
  return configureStore({
    reducer: {
      tasks: tasksSlice.reducer,
      filters: filtersSlice.reducer
    },
  });
};

export type AppStore = ReturnType<typeof tasksStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
