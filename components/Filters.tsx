"use client";

import { useRef } from "react";
import {
  resetFilters,
  setSearch,
  setSort,
  setStatus,
  setType,
} from "../store/slices/filtersSlice";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { TaskStatus, TaskType } from "../types/task";

export default function Filters() {
  const modalRef = useRef<HTMLDialogElement>(null);
  const openFiltersModal = () => modalRef.current?.showModal();
  const closeFiltersModal = () => modalRef.current?.close();
  const { search, sort, status, type } = useAppSelector(
    (state) => state.filters,
  );
  const { sortOrder, sortBy } = sort;
  const dispatch = useAppDispatch();

  const handleSort = (
    e: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>,
  ) => {
    const value = e.target.value as "asc" | "desc" | "updatedAt" | "title";

    if (value === "asc" || value === "desc") {
      dispatch(
        setSort({
          sortBy: "title",
          sortOrder: value,
        }),
      );
    } else {
      dispatch(
        setSort({
          sortBy: value,
          sortOrder: "asc",
        }),
      );
    }
  };

  return (
    <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            onChange={(e) => dispatch(setSearch(e.target.value))}
            value={search}
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg border border-slate-200 pl-3 pr-8 py-1.5 text-xs focus:border-indigo-500 focus:outline-none bg-white"
          />
        </div>

        <button
          onClick={openFiltersModal}
          title="Open Advanced Filters"
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center shrink-0"
        >
          <svg
            xmlns="http://w3.org"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
        </button>
      </div>

      <div>
        <select
          value={sortOrder}
          onChange={handleSort}
          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none bg-white font-medium text-slate-600"
        >
          <option value="asc">Sort: Ascending</option>
          <option value="desc">Sort: Descending</option>
        </select>
      </div>

      <div>
        <select
          value={sortBy}
          onChange={handleSort}
          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none bg-white font-medium text-slate-600"
        >
          <option value="updatedAt">Sort: updatedAt</option>
          <option value="title">Sort: title</option>
        </select>
      </div>

      <dialog
        ref={modalRef}
        className="backdrop:bg-slate-900/40 rounded-xl p-6 border border-slate-200 shadow-xl max-w-sm w-full bg-white"
      >
        <form className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="text-sm font-semibold text-slate-800">
              Filter Tasks
            </h3>
            <button
              type="button"
              onClick={closeFiltersModal}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          </div>

          {/* Filter by Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">
              Task Type
            </label>
            <select
              value={type}
              onChange={(e) => {
                dispatch(setType(e.target.value as TaskType));
                closeFiltersModal();
              }}
              className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-xs bg-white"
            >
              <option value="ALL">All Types</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="text">Text</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Status</label>
            <select
              value={status}
              onChange={(e) => {
                dispatch(setStatus(e.target.value as TaskStatus));
                closeFiltersModal();
              }}
              className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-xs bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="QA">QA</option>
              <option value="DONE">Done</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 justify-end text-xs font-medium">
            <button
              onClick={() => {
                dispatch(resetFilters());
                closeFiltersModal();
              }}
              type="button"
              className="px-3 py-1.5 text-slate-500 border border-slate-200 rounded-md hover:bg-slate-50"
            >
              Clear All
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
