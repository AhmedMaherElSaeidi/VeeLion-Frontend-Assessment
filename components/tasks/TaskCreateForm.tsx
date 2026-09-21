"use client";

import { useState } from "react";

type TaskCreateFormProps = {
  onCreate: (title: string) => Promise<void>;
  creating: boolean;
};

export function TaskCreateForm({ onCreate, creating }: TaskCreateFormProps) {
  const [title, setTitle] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }

    await onCreate(trimmed);
    setTitle("");
  }

  return (
    <form
      className="card"
      style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}
      onSubmit={handleSubmit}
    >
      <label htmlFor="new-task-title" className="input-label">
        New task title
      </label>
      <input
        id="new-task-title"
        className="input"
        placeholder="Add a new task..."
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <button type="submit" className="button primary" disabled={creating || !title.trim()}>
        {creating ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
