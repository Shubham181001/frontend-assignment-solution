import { selectVisibleTasks } from "../store/selector";

describe("selectVisibleTasks()", () => {
  it("filters tasks by status", () => {
    const state: any = {
      tasks: {
        ids: ["1", "2"],
        entities: {
          "1": {
            id: "1",
            title: "Task 1",
            status: "DONE",
            type: "image",
            annotationCount: 0,
            updatedAt: 1,
          },
          "2": {
            id: "2",
            title: "Task 2",
            status: "TODO",
            type: "text",
            annotationCount: 0,
            updatedAt: 2,
          },
        },
      },

      filters: {
        search: "",
        status: "DONE",
        type: "ALL",
        sort: {
          sortBy: "title",
          sortOrder: "asc",
        },
      },
    };

    const visible = selectVisibleTasks(state);

    expect(visible).toHaveLength(1);
    expect(visible[0].status).toBe("DONE");
  });
});