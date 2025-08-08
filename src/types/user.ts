import type { EmojiStyle } from "emoji-picker-react";

/**
 * Represents a universally unique identifier.
 */
export type UUID = ReturnType<typeof crypto.randomUUID>;

export type DarkModeOptions = "system" | "auto" | "light" | "dark";

/**
 * Represents a user in the application.
 */
export interface User {
  name: string | null;
  createdAt: Date;
  /**
   * must be a URL starting with "https://" or a local file reference in the form "LOCAL_FILE_" + UUID
   */
  profilePicture: string | null;
  emojisStyle: EmojiStyle;
  tasks: Task[];
  /**
   * Stores the IDs of tasks that were deleted locally.
   * Used to ensure deletions are synced correctly across devices.
   */
  deletedTasks: UUID[];
  categories: Category[];
  deletedCategories: UUID[];
  favoriteCategories: UUID[];
  colorList: string[];
  settings: AppSettings;
  theme: "system" | (string & {});
  darkmode: DarkModeOptions;
  lastSyncedAt?: Date;
}

/**
 * Represents a task in the application.
 */
export interface Task {
  id: UUID;
  done: boolean;
  pinned: boolean;
  name: string;
  description?: string;
  emoji?: string;
  color: string;
  /**
   * created at date
   */
  date: Date;
  deadline?: Date;
  category?: Category[];
  lastSave?: Date;
  sharedBy?: string;
  /**
   * Optional numeric position for drag-and-drop (for p2p sync)
   */
  position?: number;
}

/**
 * Represents a category in the application.
 */
export interface Category {
  id: UUID;
  name: string;
  emoji?: string;
  color: string;
  lastSave?: Date;
}

/**
 * Represents application settings for the user.
 */
export interface AppSettings {
  enableCategories: boolean;
  doneToBottom: boolean;
  enableGlow: boolean;
  simpleEmojiPicker: boolean;
  enableReadAloud: boolean;
  appBadge: boolean;
  showProgressBar: boolean;
  /**
   * Voice property in the format 'name::lang' to ensure uniqueness on macOS/iOS,
   * where multiple voices can share the same name.
   */
  voice: `${string}::${string}`;
  voiceVolume: number;
  sortOption: SortOption;
  reduceMotion: ReduceMotionOption;
}

export type SortOption = "dateCreated" | "dueDate" | "alphabetical" | "custom";
export type ReduceMotionOption = "system" | "on" | "off";
