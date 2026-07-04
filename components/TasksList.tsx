"use client";

import { Task as TaskType } from "../types/task";
import Task from "./Task";

export default function TasksList({ tasks }: { tasks: TaskType[] }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {tasks.map((task) => (
        <Task
          key={task.id}
          taskId={task.id}
          title={task.title}
          type={task.type}
          status={task.status}
        />
      ))}
    </div>
  );
}
