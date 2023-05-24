import { EmojiStyle } from "emoji-picker-react";

export interface User {
  name: string | null;
  createdAt: Date;
  emojisStyle: EmojiStyle;
  tasks: Task[];
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
}

export interface UserProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}
