export type TaskType = "image" | "audio" | "text" | "unknown";

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "DONE"
  | "QA"
  | "BLOCKED"
  | "UNKNOWN";

export type TaskAssignee = {
  id: string;
  name: string;
};

export type TaskUpdatedAt = number;

export type TaskMeta = {
  priority?: "high";
  note?: string;
};

export type Task = {
  id: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  assignee: TaskAssignee | null;
  updatedAt: TaskUpdatedAt;
  meta: TaskMeta;
  annotationCount: number;
};
