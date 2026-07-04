import { normalizeTask } from "../services/normalize";

describe("normalizeTask()", () => {
  it("normalizes inconsistent backend payload", () => {
    const rawTask = {
      id: "t1",
      title: "Task 1",
      type: "video",
      status: "InProgress",
      annotationCount: "10",
      updatedAt: "2024-06-28T10:00:00Z",
      assignee: null,
      meta: {},
    };

    const task = normalizeTask(rawTask);

    expect(task.id).toBe("t1");
    expect(task.type).toBe("unknown");
    expect(task.status).toBe("IN_PROGRESS");
    expect(task.annotationCount).toBe(10);
    expect(task.assignee).toBeNull();
    expect(typeof task.updatedAt).toBe("number");
  });
});