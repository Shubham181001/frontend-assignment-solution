"use client";

import Filters from "./Filters";
import Pagination from "./Pagination";
import TaskDetailsPanel from "./TaskDetailsPanel";
import TasksList from "./TasksList";
import useTaskFeed from "../hooks/useTaskFeed";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectVisibleTasks } from "../store/selector";
import { useEffect } from "react";
import { cacheLoaded } from "../store/slices/tasksSlice";
import { loadTasks } from "../services/cache";
import { fetchTasks } from "../store/thunks/tasksthunk";

export default function TasksLayout() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectVisibleTasks);

  useEffect(() => {
    async function hydrate() {
      try {
        const cached = await loadTasks();

        if (cached) {
          dispatch(cacheLoaded(cached));
        }

        dispatch(
          fetchTasks({
            page: 1,
            pageSize: 20,
          }),
        );
      } catch (err) {
        if (err instanceof Error) {
          throw new Error(err.message);
        }
      }
    }

    hydrate();
  }, [dispatch]);
  useTaskFeed();
  return (
    <div className="grid h-screen w-screen grid-cols-[25%_75%] overflow-hidden bg-slate-50 text-slate-900">
      <aside className="flex flex-col border-r max-h-screen min-h-0 border-slate-200 bg-white h-full">
        <Filters />
        <TasksList tasks={tasks} />
        <Pagination />
      </aside>
      <TaskDetailsPanel />
    </div>
  );
}
