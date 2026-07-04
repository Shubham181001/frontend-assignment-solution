"use client";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectTasksPagination } from "../store/selector";
import { fetchTasks } from "../store/thunks/tasksthunk";

export default function Pagination() {
  const dispatch = useAppDispatch();
  const { page, pageSize, total } = useAppSelector(selectTasksPagination);

  const totalPages = Math.ceil(total / pageSize);

  const handlePreviousClick = () => {
    dispatch(
      fetchTasks({
        page: page - 1,
        pageSize,
      }),
    );
  };

  const handleNextClick = () => {
    dispatch(
      fetchTasks({
        page: page + 1,
        pageSize,
      }),
    );
  };
  return (
    <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
      <button
        onClick={handlePreviousClick}
        disabled={page === 1}
        className="text-xs font-medium px-3 py-1.5 border border-slate-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent hover:bg-slate-50"
      >
        Prev
      </button>
      <span className="text-xs text-slate-500 font-medium">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={handleNextClick}
        disabled={page === totalPages}
        className="text-xs font-medium px-3 py-1.5 border border-slate-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent hover:bg-slate-50"
      >
        Next
      </button>
    </div>
  );
}
