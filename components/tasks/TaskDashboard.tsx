"use client";

import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/types/api";
import { StatusFilter } from "@/components/tasks/StatusFilter";
import { TaskCreateForm } from "@/components/tasks/TaskCreateForm";
import { TaskList } from "@/components/tasks/TaskList";

export function TaskDashboard() {
  const {
    filteredTasks,
    filter,
    loading,
    error,
    updatingTaskId,
    deletingTaskId,
    creating,
    setFilter,
    fetchTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
  } = useTasks();

  const handleToggle = (task: Task) => {
    updateTaskStatus(task.id, !task.completed);
  };

  const handleDelete = (task: Task) => {
    if (window.confirm(`Delete "${task.title}"? This can't be undone.`)) {
      deleteTask(task.id);
    }
  };

  return (
    <section className="stack">
      <header className="card" style={{ padding: "1rem" }}>
        <h1 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Task Dashboard</h1>
      </header>

      <TaskCreateForm onCreate={createTask} creating={creating} />

      <StatusFilter value={filter} onChange={setFilter} />

      {loading ? (
        <section className="card" style={{ padding: "1rem" }}>
          <p style={{ margin: 0 }}>Loading tasks...</p>
        </section>
      ) : null}

      {error ? (
        <section className="card" style={{ padding: "1rem", borderColor: "#e3b4c0", background: "#fff8fa" }}>
          <p style={{ marginTop: 0, marginBottom: "0.75rem", color: "var(--danger)" }}>{error}</p>
          <button type="button" className="button" onClick={fetchTasks}>
            Retry
          </button>
        </section>
      ) : null}

      {!loading && !error ? (
        <TaskList
          tasks={filteredTasks}
          updatingTaskId={updatingTaskId}
          deletingTaskId={deletingTaskId}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ) : null}
    </section>
  );
}