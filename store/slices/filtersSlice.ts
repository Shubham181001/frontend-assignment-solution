import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskStatus, TaskType } from "../../types/task";

type Sort = {
  sortBy: "updatedAt" | "title";
  sortOrder: "asc" | "desc";
};

type FiltersState = {
  search: string;
  status: TaskStatus | "ALL";
  type: TaskType | "ALL";
  sort: Sort;
};

const initialState: FiltersState = {
  search: "",
  status: "ALL",
  type: "ALL",
  sort: {
    sortBy: "title",
    sortOrder: "asc",
  },
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setStatus(state, action: PayloadAction<TaskStatus | "ALL">) {
      state.status = action.payload;
    },
    setType(state, action: PayloadAction<TaskType | "ALL">) {
      state.type = action.payload;
    },
    setSort(state, action: PayloadAction<Sort>) {
      state.sort = action.payload;
    },
    resetFilters(state) {
      state.search = "";
      state.status = "ALL";
      state.type = "ALL";
      state.sort.sortBy = "title";
      state.sort.sortOrder = "asc";
    },
  },
});

export const { setSearch, setStatus, setType, setSort, resetFilters } =
  filtersSlice.actions;
