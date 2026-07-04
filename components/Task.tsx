"use client";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { selectTask } from "../store/slices/tasksSlice";
import { TaskStatus, TaskType } from "../types/task";

function Task({
  taskId,
  title,
  type,
  status,
}: {
  taskId: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
}) {
  const getStatusStyles = (status: TaskStatus) => {
    switch (status) {
      case "DONE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "QA":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "IN_PROGRESS":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "TODO":
        return "bg-slate-50 text-slate-600 border-slate-200";
      case "BLOCKED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-purple-50 text-purple-700 border-purple-200";
    }
  };
  const dispatch = useAppDispatch();
  return (
    <div
      onClick={() => dispatch(selectTask(taskId))}
      className="flex items-start justify-between gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-slate-300 transition-all cursor-pointer group"
    >
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
          {title}
        </h4>
        <p className="text-[10px] text-slate-400 mt-1 capitalize">
          Type: {type}
        </p>
      </div>
      <span
        className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusStyles(status)}`}
      >
        {status}
      </span>
    </div>
  );
}

export default Task;
