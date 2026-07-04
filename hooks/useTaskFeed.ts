"use client";
import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch } from "./useAppDispatch";
import {
  annotationCreated,
  tasksAssigned,
  tasksUpdated,
} from "../store/slices/tasksSlice";
import { TaskEvent } from "../types/websocket";
import { normalizeStatus, normalizeTimeStamp } from "../services/normalize";

const MAX_RECONNECT_DELAY = 30000;

export default function useTaskFeed(): void {
  const dispatch = useAppDispatch();
  const socketRef = useRef<WebSocket | null>(null);
  const connectExecutionRef = useRef<() => void>(() => {});
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectDelayRef = useRef(1000);

  const connect = useCallback(() => {
    const ws = new WebSocket("ws://localhost:4000/ws");
    socketRef.current = ws;

    ws.onopen = () => {
      reconnectDelayRef.current = 1000;
    };

    ws.onmessage = (event: MessageEvent<string>): void => {
      const data: TaskEvent = JSON.parse(event.data);

      switch (data.kind) {
        case "task.updated":
          dispatch(
            tasksUpdated({
              id: data.payload.id,
              status: normalizeStatus(data.payload.status),
              updatedAt: normalizeTimeStamp(data.payload.updatedAt),
            }),
          );
          break;
        case "task.assigned":
          dispatch(
            tasksAssigned({
              id: data.payload.id,
              assignee: data.payload.assignee,
            }),
          );
          break;
        case "annotation.created":
          dispatch(annotationCreated({ taskId: data.payload.taskId }));
          break;
      }
    };

    ws.onclose = (event) => {
      socketRef.current = null;

      if (!event.wasClean) {
        const delay = reconnectDelayRef.current;
        console.warn(`WebSocket lost. Attempting reconnect in ${delay}ms...`);

        reconnectDelayRef.current = Math.min(delay * 2, MAX_RECONNECT_DELAY);

        reconnectTimeoutRef.current = setTimeout(() => {
          connectExecutionRef.current();
        }, delay);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket runtime error:", error);
    };
  }, [dispatch]);

  useEffect(() => {
    connectExecutionRef.current = connect;
  }, [connect]);

  useEffect(() => {
    connectExecutionRef.current();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
}
