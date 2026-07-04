"use client";

import { useAppSelector } from "../hooks/useAppSelector";
import { selectSelectedTask } from "../store/selector";
import TaskSummary from "./TaskSummary";

export default function TaskDetailsPanel() {
  const selectedTask = useAppSelector(selectSelectedTask);
  if (!selectedTask) {
    return (
      <main className="h-full overflow-y-auto bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm min-h-125">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Task Details
          </h1>
          <p className="text-slate-600 leading-relaxed">
            There is Nothing to Show yet, Choose one to find out about Task
          </p>
        </div>
      </main>
    );
  }
  return (
    <main className="h-full overflow-y-auto bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm min-h-125">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h1 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
            Task Details
          </h1>
        </div>

        <div className="grid grid-cols-[60%_40%] gap-8 items-start">
          <div className="space-y-6 h-full">
            <div>
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 capitalize">
                {selectedTask.type.toLowerCase()}
              </span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">
              {selectedTask.title}
            </h2>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {`Updated At: ${new Date(selectedTask.updatedAt).toLocaleDateString()}`}
            </h3>
            {(selectedTask.meta.priority || selectedTask.meta.note) && (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                {selectedTask.meta.priority && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Priority
                    </h4>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
                      <span
                        className={`h-2 width-2 w-2 rounded-full ${
                          selectedTask.meta.priority === "high"
                            ? "bg-rose-500"
                            : "bg-slate-400"
                        }`}
                      />
                      {selectedTask.meta.priority}
                    </span>
                  </div>
                )}

                {selectedTask.meta.note && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Note
                    </h4>
                    <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-4 border border-slate-100 whitespace-pre-line leading-relaxed">
                      {selectedTask.meta.note}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col items-baseline space-y-6 border-l border-slate-100 pl-8 h-full">
            <div>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 tracking-wide uppercase">
                {selectedTask.status}
              </span>
            </div>

            <div className="w-[95%] bg-slate-50/70 border border-slate-200/60 rounded-xl p-4 mt-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Assignee Details
              </h4>

              {selectedTask.assignee ? (
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-sm shrink-0">
                    {selectedTask.assignee.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {selectedTask.assignee.name}
                    </p>
                    <p className="text-xs text-slate-400 font-mono truncate mt-0.5">
                      ID: {selectedTask.assignee.id}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs italic text-slate-400">
                  No assignee assigned this task.
                </p>
              )}
            </div>
            <div className="w-[95%] overflow-hidden">
              <TaskSummary />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
