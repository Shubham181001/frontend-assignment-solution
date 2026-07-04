import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Task, TaskAssignee, TaskStatus } from "../../types/task";
import { fetchTasks, FetchTasksPayload } from "../thunks/tasksthunk";

export const tasksAdapter = createEntityAdapter<Task>();

type TaskUpdatedPayload = {
  id: string;
  status: TaskStatus;
  updatedAt: number;
};

type TaskAssignedPayload = {
  id: string;
  assignee: TaskAssignee | null;
};

type TaskAnnotationCreatedPayload = {
  taskId: string;
};

const initialState = tasksAdapter.getInitialState({
  loading: false,
  error: null,

  page: 1,
  pageSize: 20,
  total: 0,
  selectedTaskId: null as string | null,
  isStale: false
});

// type TaskState = typeof initialState;

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    tasksUpdated(state, action: PayloadAction<TaskUpdatedPayload>) {
      tasksAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          status: action.payload.status,
          updatedAt: action.payload.updatedAt,
        },
      });
    },
    tasksAssigned(state, action: PayloadAction<TaskAssignedPayload>) {
      tasksAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          assignee: action.payload.assignee,
        },
      });
    },
    annotationCreated(
      state,
      action: PayloadAction<TaskAnnotationCreatedPayload>,
    ) {
      const task = state.entities[action.payload.taskId];
      if (task) {
        task.annotationCount += 1;
      }
    },
    selectTask(state, action: PayloadAction<string>) {
      state.selectedTaskId = action.payload;
    },
    cacheLoaded(state, action: PayloadAction<FetchTasksPayload>) {
      tasksAdapter.setAll(state, action.payload.tasks);

      state.page = action.payload.page;
      state.pageSize = action.payload.pageSize;
      state.error = null;
      state.total = action.payload.total;
      state.loading = false;
      state.isStale = true;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Something went wrong!!!";
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      tasksAdapter.setAll(state, action.payload.tasks);

      state.page = action.payload.page;
      state.pageSize = action.payload.pageSize;
      state.error = null;
      state.total = action.payload.total;
      state.loading = false;
      state.isStale = false;
    });
  },
});

export const { tasksUpdated, tasksAssigned, annotationCreated, selectTask, cacheLoaded } = tasksSlice.actions;
