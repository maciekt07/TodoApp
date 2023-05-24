import { EmojiStyle } from "emoji-picker-react";
import { User } from "../types/user";

export const defaultUser: User = {
  name: null,
  createdAt: new Date(),
  emojisStyle: EmojiStyle.APPLE,
  tasks: [],
};
