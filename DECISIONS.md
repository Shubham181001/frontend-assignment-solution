# DECISIONS.md

# Frontend Assignment Decisions

## 1. State Management

I chose Redux Toolkit with `createAsyncThunk` and `createEntityAdapter`.

`createEntityAdapter` was a natural fit because the application frequently receives incremental updates through WebSocket events. Instead of searching an array every time a task changes, tasks are stored as `{ ids, entities }`, allowing updates by id in constant time using `updateOne()`.

I chose `createAsyncThunk` instead of RTK Query because the assignment required additional responsibilities beyond simple data fetching:

- normalization of inconsistent backend data
- IndexedDB caching
- custom streaming logic
- manual WebSocket updates

Using thunks kept all of these concerns under my control.

---

# 2. Data Normalization

The backend intentionally returns inconsistent payloads.
Examples include:

- mixed timestamp formats (ISO strings and epoch milliseconds)
- inconsistent status values (`done`, `InProgress`, `BLOCKED`, etc.)
- unknown task types (`video`)
- numeric values returned as strings
- nullable assignees

Instead of letting UI components deal with these inconsistencies, I created a dedicated normalization layer.
The normalizer converts every API response into a predictable internal model before it enters Redux.

Examples:

- timestamps → epoch milliseconds
- status → normalized union type
- annotation counts → number
- unknown task types → `"unknown"`

This guarantees that every component consumes consistent data regardless of backend inconsistencies.

---

# 3. Selectors

The Redux store intentionally contains only normalized data.
Filtering, sorting, searching and pagination-related derived values are implemented using memoized selectors instead of storing duplicate state.
This keeps Redux as the single source of truth while avoiding unnecessary recalculations and component re-renders.

---

# 4. Real-time Updates

Real-time updates are handled through a custom `useTaskFeed` hook.

The hook:

- establishes the WebSocket connection
- listens for incoming events
- normalizes event payloads
- dispatches Redux actions
- reconnects automatically using exponential backoff
- cleans up sockets and timers when the component unmounts

Incoming events update existing entities using `updateOne()`.
This avoids refetching the complete task list whenever only a single task changes.

---

# 5. Streamed AI Summary

The task summary endpoint returns data as a streaming response.
Instead of waiting for the entire response, I consume the stream using the browser's `ReadableStream` API and a `TextDecoder`.
Each chunk is appended to component state as soon as it arrives, allowing the user to watch the summary appear incrementally.
When the selected task changes, the previous request is cancelled using `AbortController` to prevent stale summaries from rendering.

---

# 6. Safe Markdown Rendering

The streamed summary contains untrusted markdown.
The server intentionally includes HTML and script payloads to simulate malicious content.
I render markdown using `react-markdown` and sanitize it with `rehype-sanitize`.
Sanitization happens immediately before rendering, ensuring injected HTML or JavaScript cannot execute inside the application.

---

# 7. IndexedDB Caching

I implemented client-side caching using `localforage`, which uses IndexedDB internally.
The application follows a stale-while-revalidate strategy.

On startup:

1. Load cached tasks from IndexedDB.
2. Immediately render cached data.
3. Fetch fresh data from the backend.
4. Update both Redux and IndexedDB.

This provides an instant initial render while still ensuring the UI eventually reflects the latest server state.
Cached data is marked as stale until the fresh request completes.

---

# 8. Error Handling

I handled several failure scenarios explicitly:

- failed REST requests
- failed streaming requests
- unsupported streaming
- aborted summary requests
- WebSocket disconnects
- null assignees
- unknown task types
- inconsistent backend payloads
Rather than hiding failures, the UI exposes loading and error states where appropriate.

---

# 9. Tradeoffs

The assignment had a two-day time limit.
I prioritized correctness and maintainability over implementing every possible optimization.
I deliberately kept streamed summaries in component state instead of Redux because summaries belong only to the currently selected task.
Similarly, I chose server-side pagination instead of caching every page in Redux simultaneously.

---

# 10. AI Usage

I used AI primarily as a technical discussion partner.
It helped me validate architectural ideas, review implementation decisions, and explain unfamiliar APIs such as WebSockets, streaming responses, Entity Adapter, and IndexedDB.
All production code was manually written, adapted, debugged, and tested before being included in the project.
I verified AI suggestions through implementation and runtime testing rather than copying them directly.

# Bug Hunt

### Bug 1 — Stale closure

The interval callback captured the initial value of `tick`, causing it to repeatedly set the same value.
Using the functional updater (`setTick(prev => prev + 1)`) ensures each update uses the latest state.

---

### Bug 2 — State mutation

The reducer mutated the existing tasks array using `push`.
React state should be treated as immutable.
Returning a new array (`[...prev, task]`) ensures React detects the update.

---

### Bug 3 — Sorting mutation

Array.sort mutates the original array.
Sorting a copied array (`[...tasks].sort(...)`) preserves state immutability.

---

### Bug 4 — Index as key

Using the array index as the React key causes incorrect reconciliation when task ordering changes.
Using `task.id` provides stable identity.

---

### Bug 5 — Missing selectedId guard

The component fetched `/api/tasks/null` on initial render.
The effect should return early when no task is selected.

---

### Bug 6 — Missing apiBase dependency

The fetch effect depends on `apiBase` but doesn't include it in the dependency array.
Changing the base URL would otherwise not trigger a refetch.