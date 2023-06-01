import { EmojiStyle } from "emoji-picker-react";

export interface User {
  name: string | null;
  createdAt: Date;
  profilePicture: string | null;
  emojisStyle: EmojiStyle;
  tasks: Task[];
  categories: Category[];
  enableCategories: boolean;
}

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
}

export interface Category {
  name: string;
  id: number;
  emoji?: string;
  color: string;
}

export interface UserProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}
