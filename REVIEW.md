# Reviews made

Review of the existing Task Dashboard and Activity Feed modules, before the refactor applied

## Modified Files

**`app/activity/page.tsx`** — full rewrite of the same page, same functionality, much simpler:

- **`Performance:`** Removed the `setInterval`/`tick` mechanism that re-ran filtering every 1.4 seconds for no reason.
- **`Performance:`** Removed `forcedList` and the extra state/effects that existed only to force re-renders.
- **`Maintability:`** Collapsed duplicate functions (`formatTimeA`/`formatTimeB`, `applyFilterA`/`applyFilterB`) into one `formatTime()` and one `filterActivity()`.
- **`Maintability:`** The `allActivity`, `shownActivity`, and `forcedList` all held near-identical data, so replaced the three-state effect chain with a single `useMemo`, so it doesn't need its own state, its own effect, or the two effects downstream of it..
- **`UX Issue:`** Added the same `loading` / `error` pattern already used in `useTasks`, including an empty state ("No activity matches this search.") distinct from the error state, AS previously a failed fetch just silently showed an empty list.
- **`UX Issue:`** Fixed a bug where every item's timestamp was rendered twice by collapsing `formatTimeA` and `formatTimeB` because they were both called in the JSX.
- **`UX Issue:`** Aded a visually-hidden `<label>` and a new `.input-label` utility class in `globals.css`, tied to the input via `id`, As input was using placeholder-only tha t disappears after typing, making it not clear for some audience.
- **`UX Issue:`** Added a new form to create activities, as previously there was no a handler to create one.

## New Features

**`components/activity/ActivityCreateForm.tsx`**

- Added a "Log it" form (action + optional info) component, used within **`app/activity/page.tsx`**

**`hooks/useActivity.ts`**

- **`Maintability:`** Handling state management within **`app/activity/page.tsx`** using a hook, same as tasks.

**`lib/backendApi.ts`**

- Added `createActivityInBackend(action, info?)`.
- Added `createTaskInBackend(title)` and `deleteTaskInBackend(taskId)`.

**`app/api/activity/route.ts`**

- Added `POST`, to communicate with the backend's existing `POST /activity`.

**`app/api/tasks/route.ts`**

- Added `POST`, proxying to the backend's existing `POST /tasks`.

**`app/api/tasks/[id]/route.ts`**

- Added `DELETE`, proxying to the backend's existing `DELETE /tasks/:id`.

**`hooks/useTasks.ts`**

- Added `createTask(title)` and `deleteTask(taskId)`, each with their own loading state
  (`creating`, `deletingTaskId`) following the same pattern as the existing `updatingTaskId`.

**`components/tasks/TaskDashboard.tsx`**

- Wired up delete, with a `window.confirm()` prompt before deleting (no new dependency for a
  confirmation dialog — kept it plain).

**`components/tasks/TaskItem.tsx` / `TaskList.tsx`**

- Added a "Delete" button next to the existing toggle button, and threaded the new
  `deletingTaskId`/`onDelete` props through.
