import localforage from "localforage";
import { FetchTasksPayload } from "../store/thunks/tasksthunk";

export const taskCache = localforage.createInstance({
  name: "annotation-console",
  storeName: "tasks",
});

const CACHE_KEY = "latest_tasks";

export async function saveTasks(payload: FetchTasksPayload) {
    await taskCache.setItem(CACHE_KEY, payload);
}

export async function loadTasks() {
    return taskCache.getItem<FetchTasksPayload>(CACHE_KEY);
}