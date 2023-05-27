import { EmojiStyle } from "emoji-picker-react";
import { User } from "../types/user";

export const defaultUser: User = {
  name: null,
  createdAt: new Date(),
  profilePicture: null,
  emojisStyle: EmojiStyle.APPLE,
  tasks: [],
};
