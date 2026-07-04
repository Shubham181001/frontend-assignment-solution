import { RawTask, TasksResponse } from "../types/api";

const BASE_URL = "http://localhost:4000";

//function to fetch all tasks;
export async function getTasks({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<TasksResponse> {
  const response = await fetch(
    `${BASE_URL}/api/tasks?page=${page}&pagesize=${pageSize}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return await response.json();
}

//function to fetch a single task based on page, pageSize, type, status
export async function getTask({ id }: { id: string }): Promise<RawTask> {
  const response = await fetch(`${BASE_URL}/api/tasks/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch task");
  }
  return await response.json();
}
