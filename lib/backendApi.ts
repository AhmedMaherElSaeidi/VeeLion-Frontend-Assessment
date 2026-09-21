import { BACKEND_BASE_URL } from "@/lib/constants";
import type {
  ActivityLog,
  ErrorResponse,
  Task,
  TaskResponse,
  TasksResponse,
  TasksSummary,
} from "@/types/api";

function buildBackendUrl(path: string): string {
  return `${BACKEND_BASE_URL}${path}`;
}

async function parseError(response: Response): Promise<string> {
  let fallback = `Request failed with status ${response.status}`;

  try {
    const body = (await response.json()) as ErrorResponse;
    return body.error?.message || fallback;
  } catch {
    return fallback;
  }
}

export async function getTasksFromBackend(): Promise<Task[]> {
  try {
    const response = await fetch(buildBackendUrl("/tasks"), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    const body = (await response.json()) as TasksResponse;
    return body.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to load tasks.");
  }
}

export async function createTaskInBackend(title: string): Promise<Task> {
  try {
    const response = await fetch(buildBackendUrl("/tasks"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    const body = (await response.json()) as TaskResponse;
    return body.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create task.");
  }
}

export async function updateTaskInBackend(taskId: string, completed: boolean): Promise<Task> {
  try {
    const response = await fetch(buildBackendUrl(`/tasks/${taskId}`), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    const body = (await response.json()) as TaskResponse;
    return body.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update task.");
  }
}

export async function deleteTaskInBackend(taskId: string): Promise<void> {
  try {
    const response = await fetch(buildBackendUrl(`/tasks/${taskId}`), {
      method: "DELETE",
      cache: "no-store",
    });

    if (!response.ok && response.status !== 204) {
      throw new Error(await parseError(response));
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete task.");
  }
}

export async function getActivityFromBackend(): Promise<ActivityLog[]> {
  try {
    const response = await fetch(buildBackendUrl("/activity"), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    return (await response.json()) as ActivityLog[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to load activity logs.");
  }
}

export async function createActivityInBackend(action: string, info?: string): Promise<ActivityLog> {
  try {
    const response = await fetch(buildBackendUrl("/activity"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info ? { action, info } : { action }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    return (await response.json()) as ActivityLog;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create activity entry.");
  }
}

export async function deleteActivityInBackend(activityId: string): Promise<void> {
  try {
    const response = await fetch(buildBackendUrl(`/activity/${activityId}`), {
      method: "DELETE",
      cache: "no-store",
    });

    if (!response.ok && response.status !== 204) {
      throw new Error(await parseError(response));
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete activity entry.");
  }
}

export type ReportsWindowParams = {
  hours?: string;
  minutes?: string;
  seconds?: string;
};

export async function getReportsSummaryFromBackend(
  window?: ReportsWindowParams,
): Promise<TasksSummary> {
  try {
    const params = new URLSearchParams();

    if (window?.hours !== undefined && window.hours !== "") params.set("hours", window.hours);
    if (window?.minutes !== undefined && window.minutes !== "")
      params.set("minutes", window.minutes);
    if (window?.seconds !== undefined && window.seconds !== "")
      params.set("seconds", window.seconds);

    const query = params.toString();
    const path = query ? `/reports/tasks-summary?${query}` : "/reports/tasks-summary";

    const response = await fetch(buildBackendUrl(path), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    return (await response.json()) as TasksSummary;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to load the tasks summary.");
  }
}
