import { EmojiStyle } from "emoji-picker-react";

/**
 * Represents a user in the application.
 */
export interface User {
  name: string | null;
  createdAt: Date;
  profilePicture: string | URL | null;
  emojisStyle: EmojiStyle;
  tasks: Task[];
  categories: Category[];
  settings: AppSettings[];
}

/**
 * Represents a task in the application.
 */
export interface Task {
  id: number;
  done: boolean;
  pinned: boolean;
  name: string;
  description?: string;
  emoji?: string;
  color: string;
  date: Date;
  deadline?: Date;
  category?: Category[];
  lastSave?: Date;
}

/**
 * Represents a category in the application.
 */
export interface Category {
  name: string;
  id: number;
  emoji?: string;
  color: string;
}

/**
 * Represents application settings for the user.
 */
export interface AppSettings {
  enableCategories: boolean;
  doneToBottom: boolean;
  enableGlow: boolean;
}

/**
 * Represents the props for a component that requires user-related data.
 */
export interface UserProps {
  user: User; // User data
  setUser: React.Dispatch<React.SetStateAction<User>>; // Function to update user data
}
