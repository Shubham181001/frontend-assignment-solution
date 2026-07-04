export type TaskUpdatedEvent = {
  kind: "task.updated";
  payload: {
    id: string;
    status: string;
    updatedAt: number;
  };
};

export type TaskAssignedEvent = {
  kind: "task.assigned";
  payload: {
    id: string;
    assignee: {
      id: string;
      name: string;
    } | null;
  };
};

export type AnnotationCreatedEvent = {
  kind: "annotation.created";
  payload: {
    taskId: string;
    by: string;
    at: number;
  };
};

export type TaskEvent =
  | TaskUpdatedEvent
  | TaskAssignedEvent
  | AnnotationCreatedEvent;
