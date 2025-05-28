import { Task, UUID } from "../types/user";
import * as LZString from "lz-string";

export interface SyncData {
  version: number;
  tasks: Task[];
  deletedTasks: UUID[];
  lastModified: Date;
}

/**
 * Merges two arrays of tasks, keeping only non-deleted tasks from both devices
 */
function mergeTasks(
  localTasks: Task[],
  remoteTasks: Task[],
  localDeleted: UUID[],
  remoteDeleted: UUID[],
): Task[] {
  const mergedTasks = new Map<UUID, Task>();
  const allDeletedTasks = new Set([...localDeleted, ...remoteDeleted]);
  const taskOrder = new Map<UUID, number>();

  // process tasks in creation date order to establish base ordering
  const allTasks = [...localTasks, ...remoteTasks]
    .filter((task) => !allDeletedTasks.has(task.id))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  allTasks.forEach((task, index) => {
    const existingTask = mergedTasks.get(task.id);
    if (!existingTask) {
      mergedTasks.set(task.id, task);
      taskOrder.set(task.id, index);
    } else {
      // if task exists use the one with latest lastSave
      const existingDate = existingTask.lastSave ? new Date(existingTask.lastSave) : new Date(0);
      const newDate = task.lastSave ? new Date(task.lastSave) : new Date(0);

      if (newDate > existingDate) {
        mergedTasks.set(task.id, task);
      }
    }
  });

  // convert to array and sort by creation date and then by task order
  return Array.from(mergedTasks.values()).sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateA === dateB) {
      const orderA = taskOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER;
      const orderB = taskOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    }
    return dateA - dateB;
  });
}

/**
 * Prepares sync data to be sent to another device
 */
export function prepareSyncData(tasks: Task[], deletedTasks: UUID[]): SyncData {
  return {
    version: 1,
    tasks,
    deletedTasks,
    lastModified: new Date(),
  };
}

/**
 * Compresses sync data for transmission
 */
export function compressSyncData(data: SyncData): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(data));
}

/**
 * Decompresses and parses sync data from transmission
 */
export function decompressSyncData(compressed: string): SyncData | null {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
    if (!decompressed) return null;

    const data = JSON.parse(decompressed) as SyncData;
    // convert date strings back to Date objects
    data.lastModified = new Date(data.lastModified);
    data.tasks.forEach((task) => {
      if (task.lastSave) task.lastSave = new Date(task.lastSave);
      if (task.date) task.date = new Date(task.date);
      if (task.deadline) task.deadline = new Date(task.deadline);
    });

    return data;
  } catch (e) {
    console.error("Failed to decompress sync data:", e);
    return null;
  }
}

/**
 * Merges remote sync data with local data and properly handles deleted tasks
 */
export function mergeSyncData(
  localTasks: Task[],
  localDeletedTasks: UUID[],
  remoteSyncData: SyncData,
): { tasks: Task[]; deletedTasks: UUID[]; lastSyncedAt: Date } {
  // merge tasks excluding all deleted tasks from both devices
  const tasks = mergeTasks(
    localTasks,
    remoteSyncData.tasks,
    localDeletedTasks,
    remoteSyncData.deletedTasks,
  );

  // combine deleted tasks from both devices
  const deletedTasks = [...new Set([...localDeletedTasks, ...remoteSyncData.deletedTasks])];

  // set lastSyncedAt to the most recent lastModified timestamp
  const lastSyncedAt = new Date(
    Math.max(remoteSyncData.lastModified.getTime(), new Date().getTime()),
  );

  return { tasks, deletedTasks, lastSyncedAt };
}
