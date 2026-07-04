import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTasks } from "../../services/api";
import { normalizeTask } from "../../services/normalize";
import { Task } from "../../types/task";
import { saveTasks } from "../../services/cache";

export type FetchTasksPayload = {
  tasks: Task[];
  page: number;
  pageSize: number;
  total: number;
};

export const fetchTasks = createAsyncThunk<
  FetchTasksPayload,
  { page: number; pageSize: number }
>("api/tasks", async ({ page, pageSize }) => {
  const tasksResponse = await getTasks({ page, pageSize });
  const normalizedTasks = tasksResponse.items.map((task) =>
    normalizeTask(task),
  );
  saveTasks({
    tasks: normalizedTasks,
    page: tasksResponse.page,
    pageSize: tasksResponse.pageSize,
    total: tasksResponse.total,
  });
  return {
    tasks: normalizedTasks,
    page: tasksResponse.page,
    pageSize: tasksResponse.pageSize,
    total: tasksResponse.total,
  };
});
