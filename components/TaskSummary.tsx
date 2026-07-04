import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectSelectedTask } from "../store/selector";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

export default function TaskSummary() {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const selectedTask = useAppSelector(selectSelectedTask);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSummary() {
      if (!selectedTask?.id) {
        setSummary("");
        return;
      }
      setIsLoading(true);
      setError("");
      setSummary("");

      try {
        const response = await fetch(
          `http://localhost:4000/api/tasks/${selectedTask.id}/summary`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch summary");
        }
        if (!response.body) {
          throw new Error("Streaming not supported");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const cleanLine = line.trim();
            if (!cleanLine || !cleanLine.startsWith("data: ")) continue;

            const jsonStr = cleanLine.replace("data: ", "").trim();
            if (jsonStr === "end") break;
            try {
              const chunk = JSON.parse(jsonStr);
              const textChunk =
                typeof chunk === "string" ? chunk : chunk.text || "";
              setSummary((prev) => prev + textChunk);
            } catch (jsonErr) {
              console.error("Error parsing stream line:", cleanLine, jsonErr);
            }
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            return;
          }
          setError(err.message || "An unexpected error occurred");
        } else {
          setError("Unexpected Error");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchSummary();

    return () => controller.abort();
  }, [selectedTask?.id]);

  if (!selectedTask?.id) {
    return (
      <div className="p-4 text-gray-500">
        Please select a task to see its summary.
      </div>
    );
  }

  return (
    <div className="task-summary-container p-4 border rounded-md shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-2">AI Task Summary</h3>

      {error && (
        <div className="text-red-500 bg-red-50 p-2 rounded mb-2 text-sm">
          Error: {error}
        </div>
      )}

      {summary && (
        <div className="prose max-w-none overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none text-gray-800">
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
            {summary}
          </ReactMarkdown>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center space-x-2 text-sm text-blue-500 mt-2">
          <span className="animate-pulse">●</span>
          <span>Summarizing...</span>
        </div>
      )}
    </div>
  );
}
