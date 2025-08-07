import type { OtherDataSyncOption, SyncData } from "../types/sync";
import type { Task, UUID, Category, User, AppSettings } from "../types/user";
import * as LZString from "lz-string";
import { getProfilePictureFromDB } from "./profilePictureStorage";
import { showToast } from "./showToast";

function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const clone = { ...obj };
  keys.forEach((key) => {
    delete clone[key];
  });
  return clone;
}

export async function extractOtherData(
  user: User,
): Promise<Partial<User> & { profilePictureData?: string }> {
  // remove emojis style from sync
  const otherData = omit(user, ["emojisStyle"]);

  let profilePictureData: string | undefined = undefined;

  if (otherData.profilePicture && otherData.profilePicture.startsWith("LOCAL_FILE")) {
    try {
      const data = await getProfilePictureFromDB(otherData.profilePicture);
      if (data) profilePictureData = data;
    } catch (err) {
      showToast("Failed to get profile picture from DB", { type: "error" });
      console.error("Failed to get profile picture from DB:", err);
    }
  }

  if (otherData.settings) {
    otherData.settings = omit(otherData.settings, [
      "appBadge",
      "voice",
      "voiceVolume",
    ]) as unknown as AppSettings;
  }

  return {
    ...otherData,
    ...(profilePictureData ? { profilePictureData } : {}),
  };
}

/**
 * Merges two arrays of tasks, keeping only non-deleted tasks from both devices
 * and removing references to deleted categories from tasks
 */
function mergeTasks(
  localTasks: Task[],
  remoteTasks: Task[],
  localDeleted: UUID[],
  remoteDeleted: UUID[],
  localDeletedCategories: UUID[],
  remoteDeletedCategories: UUID[],
): Task[] {
  const mergedTasks = new Map<UUID, Task>();
  const allDeletedTasks = new Set([...localDeleted, ...remoteDeleted]);
  const allDeletedCategories = new Set([...localDeletedCategories, ...remoteDeletedCategories]);
  const taskOrder = new Map<UUID, number>();

  // process tasks in creation date order to establish base ordering
  const processedTasks = [...localTasks, ...remoteTasks]
    .filter((task) => !allDeletedTasks.has(task.id))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((task: Task) => {
      // clean up task categories, removing any references to deleted categories
      if (task.category) {
        const filteredCategories = task.category.filter(
          (cat: Category) => !allDeletedCategories.has(cat.id),
        );
        if (filteredCategories.length === 0) {
          return { ...task, category: undefined };
        }
        return { ...task, category: filteredCategories };
      }
      return task;
    });

  processedTasks.forEach((task: Task, index: number) => {
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
 * Merges two arrays of categories, keeping only non-deleted categories from both devices
 */
function mergeCategories(
  localCategories: Category[],
  remoteCategories: Category[],
  localDeleted: UUID[],
  remoteDeleted: UUID[],
): Category[] {
  const mergedCategories = new Map<UUID, Category>();
  const allDeletedCategories = new Set([...localDeleted, ...remoteDeleted]);

  // combine and filter out deleted categories
  [...localCategories, ...remoteCategories]
    .filter((category) => !allDeletedCategories.has(category.id))
    .forEach((category) => {
      const existing = mergedCategories.get(category.id);
      if (!existing) {
        mergedCategories.set(category.id, category);
      } else {
        // if category exists use the one with latest lastSave
        const existingDate = existing.lastSave ? new Date(existing.lastSave) : new Date(0);
        const newDate = category.lastSave ? new Date(category.lastSave) : new Date(0);

        if (newDate > existingDate) {
          mergedCategories.set(category.id, category);
        }
      }
    });

  // sort by lastSave descending, fallback to name ascending
  return Array.from(mergedCategories.values()).sort((a, b) => {
    const aTime = a.lastSave ? new Date(a.lastSave).getTime() : 0;
    const bTime = b.lastSave ? new Date(b.lastSave).getTime() : 0;

    if (aTime !== bTime) {
      return bTime - aTime; // newest first
    }

    return a.name.localeCompare(b.name); // fallback alphabetical
  });
}
/**
 * Merges favorite categories based on the category's lastSave timestamp
 */
function mergeFavoriteCategories(
  localFavorites: UUID[],
  remoteFavorites: UUID[],
  localCategories: Category[],
  remoteCategories: Category[],
): UUID[] {
  const categoryMap = new Map<UUID, Category>();

  // get the most up to date version of each category based on lastSave
  [...localCategories, ...remoteCategories].forEach((category) => {
    const existing = categoryMap.get(category.id);
    if (
      !existing ||
      (category.lastSave &&
        (!existing.lastSave || new Date(category.lastSave) > new Date(existing.lastSave)))
    ) {
      categoryMap.set(category.id, category);
    }
  });

  // for each category use the favorite state from whichever device has the most recent lastSave
  return Array.from(categoryMap.entries())
    .filter(([id]) => {
      const localCat = localCategories.find((c) => c.id === id);
      const remoteCat = remoteCategories.find((c) => c.id === id);

      if (localCat && remoteCat) {
        const localDate = localCat.lastSave ? new Date(localCat.lastSave) : new Date(0);
        const remoteDate = remoteCat.lastSave ? new Date(remoteCat.lastSave) : new Date(0);

        // use favorite status from the device with the most recent category change
        return localDate > remoteDate ? localFavorites.includes(id) : remoteFavorites.includes(id);
      }

      // if category only exists on one device use its favorite status
      return localCat ? localFavorites.includes(id) : remoteFavorites.includes(id);
    })
    .map(([id]) => id);
}

/**
 * Prepares sync data to be sent to another device
 */
export function prepareSyncData(
  tasks: Task[],
  deletedTasks: UUID[],
  categories: Category[],
  deletedCategories: UUID[],
  favoriteCategories: UUID[],
  otherData?: Partial<User>,
): SyncData {
  return {
    version: 1,
    tasks,
    deletedTasks,
    categories,
    deletedCategories,
    favoriteCategories,
    lastModified: new Date(),
    ...(otherData ? { otherData } : {}),
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
 * @param syncOption 'this_device' | 'other_device' | 'no_sync' (for otherData)
 */
export function mergeSyncData(
  localTasks: Task[],
  localDeletedTasks: UUID[],
  localCategories: Category[],
  localDeletedCategories: UUID[],
  localFavoriteCategories: UUID[],
  syncDataStr: string,
  syncOption: OtherDataSyncOption,
  localOtherData?: Partial<User>,
): {
  tasks: Task[];
  deletedTasks: UUID[];
  categories: Category[];
  deletedCategories: UUID[];
  favoriteCategories: UUID[];
  otherData?: Partial<User>;
} {
  const syncData: SyncData = JSON.parse(LZString.decompressFromEncodedURIComponent(syncDataStr));

  // merge tasks
  const mergedTasks = mergeTasks(
    localTasks,
    syncData.tasks,
    localDeletedTasks,
    syncData.deletedTasks,
    localDeletedCategories,
    syncData.deletedCategories,
  );

  // merge categories
  const mergedCategories = mergeCategories(
    localCategories,
    syncData.categories,
    localDeletedCategories,
    syncData.deletedCategories,
  );

  // Store the combined deleted items
  const mergedDeletedTasks = Array.from(new Set([...localDeletedTasks, ...syncData.deletedTasks]));
  const mergedDeletedCategories = Array.from(
    new Set([...localDeletedCategories, ...syncData.deletedCategories]),
  );

  // remove deleted tasks and categories from merged lists
  const finalTasks = mergedTasks.filter((task) => !mergedDeletedTasks.includes(task.id));
  const finalCategories = mergedCategories.filter(
    (cat) => !mergedDeletedCategories.includes(cat.id),
  );

  // merge favorite categories
  const finalFavoriteCategories = mergeFavoriteCategories(
    localFavoriteCategories,
    syncData.favoriteCategories || [],
    finalCategories,
    syncData.categories,
  );

  // merge/select otherData
  let mergedOtherData: Partial<User> | undefined = undefined;
  if (syncOption === "this_device") {
    mergedOtherData = localOtherData;
  } else if (syncOption === "other_device") {
    mergedOtherData = syncData.otherData;
  } // else no_sync: leave undefined
  return {
    tasks: finalTasks,
    deletedTasks: mergedDeletedTasks,
    categories: finalCategories,
    deletedCategories: mergedDeletedCategories,
    favoriteCategories: finalFavoriteCategories,
    ...(mergedOtherData ? { otherData: mergedOtherData } : {}),
  };
}
