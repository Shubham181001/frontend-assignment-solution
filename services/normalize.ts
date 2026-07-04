import { RawTask } from "../types/api";
import { Task, TaskStatus, TaskType } from "../types/task";

export function normalizeType(type: string): TaskType {
  switch (type.toLowerCase()) {
    case "image":
    case "text":
    case "audio":
      return type.toLowerCase() as TaskType;

    default:
      return "unknown";
  }
}

export function normalizeStatus(status: string): TaskStatus {
  switch (status.toLowerCase()) {
    case "in_progress":
    case "inprogress":
      return "IN_PROGRESS";
    case "blocked":
      return "BLOCKED";
    case "todo":
      return "TODO";
    case "qa":
      return "QA";
    case "done":
      return "DONE";

    default:
      return "UNKNOWN";
  }
}

export function normalizeAnnotationCount(value: string | number): number {
  return Number(value);
}

export function normalizeTimeStamp(value: string | number) {
  if (typeof value === "number") {
    return value;
  }

  return new Date(value).getTime();
}

export function normalizeTask(raw: RawTask): Task {
  return {
    id: raw.id,
    title: raw.title,
    type: normalizeType(raw.type),
    status: normalizeStatus(raw.status),
    assignee: raw.assignee,
    updatedAt: normalizeTimeStamp(raw.updatedAt),
    annotationCount: normalizeAnnotationCount(raw.annotationCount),
    meta: {
      priority: raw.meta.priority === "high" ? raw.meta.priority : undefined,
      note: typeof raw.meta.note === "string" ? raw.meta.note : undefined,
    },
  };
}
