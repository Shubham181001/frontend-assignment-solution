import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { tasksAdapter } from "./slices/tasksSlice";

export const selectTasksState = (state: RootState) => state.tasks;
export const selectFilters = (state: RootState) => state.filters;

export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectIds: selectTaskIds,
  selectTotal: selectTotalTasksCount,
} = tasksAdapter.getSelectors(selectTasksState);

export const selectTasksLoading = (state: RootState) => state.tasks.loading;

export const selectTasksError = (state: RootState) => state.tasks.error;

export const selectTasksPagination = createSelector(
  [selectTasksState],
  ({ page, pageSize, total }) => ({
    page,
    pageSize,
    total,
  }),
);

export const selectTotalAnnotationsCount = createSelector(
  [selectAllTasks],
  (tasks) => tasks.reduce((sum, task) => sum + task.annotationCount, 0),
);

export const selectSelectedTask = (state: RootState) => {
  const selectedTaskId = state.tasks.selectedTaskId;
  return selectedTaskId ? selectTaskById(state, selectedTaskId) : null;
};

export const selectVisibleTasks = createSelector(
  [selectAllTasks, selectFilters],
  (tasks, filters) => {
    let FilteredTasks = tasks;
    if (filters.status !== "ALL") {
      FilteredTasks = FilteredTasks.filter(
        (task) => task.status === filters.status,
      );
    }
    if (filters.type !== "ALL") {
      FilteredTasks = FilteredTasks.filter(
        (filteredTask) => filteredTask.type === filters.type,
      );
    }
    if (filters.search !== "") {
      FilteredTasks = FilteredTasks.filter((task) =>
        task.title.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }
    let visibleTasks = FilteredTasks;
    if (filters.sort.sortBy === "title") {
      visibleTasks = [...FilteredTasks].sort(
        (a, b) =>
          parseInt(a.title.substring(5)) - parseInt(b.title.substring(5)),
      );
    } else {
      visibleTasks = [...FilteredTasks].sort(
        (a, b) => b.updatedAt - a.updatedAt,
      );
    }

    if (filters.sort.sortOrder !== "asc") {
      visibleTasks.reverse();
    }

    return visibleTasks;
  },
);
