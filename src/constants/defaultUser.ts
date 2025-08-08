import { EmojiStyle } from "emoji-picker-react";
import type { User } from "../types/user";
import { systemInfo } from "../utils";

/**
 * Represents a default user object.
 */
export const defaultUser: User = {
  name: null,
  createdAt: new Date(),
  profilePicture: null,
  emojisStyle:
    systemInfo.os === "iOS" || systemInfo.os === "macOS" ? EmojiStyle.NATIVE : EmojiStyle.APPLE,
  tasks: [],
  deletedTasks: [],
  theme: "system",
  darkmode: "auto",
  settings: {
    enableCategories: true,
    doneToBottom: false,
    enableGlow: true,
    simpleEmojiPicker: false,
    enableReadAloud: "speechSynthesis" in window,
    voice: "Microsoft Mark - English (United States)::en-US",
    voiceVolume: 0.6,
    appBadge: false,
    showProgressBar: true,
    sortOption: "dateCreated",
    reduceMotion: "system",
  },
  categories: [
    { id: "857f0db6-43b2-43eb-8143-ec4e26472516", name: "Home", emoji: "1f3e0", color: "#53e45d" },
    { id: "0292cba5-f6e2-41c4-b5a7-c59a0aaecfe3", name: "Work", emoji: "1f3e2", color: "#248eff" },
    {
      id: "ebe6ce8b-471f-4632-a23b-578e1038ce51",
      name: "Coding",
      emoji: "1f4bb",
      color: "#835CF0",
    },
    {
      id: "393068a9-9db7-4dfa-a00f-cd359f8024e8",
      name: "Health/Fitness",
      emoji: "1f4aa",
      color: "#fee567",
    },
    {
      id: "afa0fdb4-f668-4d5a-9ad0-4e22d2b8e841",
      name: "Education",
      emoji: "1f4da",
      color: "#ff9e42",
    },
    {
      id: "a47a4af1-d720-41eb-9121-d3728605a62b",
      name: "Personal",
      emoji: "1f464",
      color: "#f086fe",
    },
  ],
  deletedCategories: [],
  favoriteCategories: ["ebe6ce8b-471f-4632-a23b-578e1038ce51"],
  //TODO: make default colors better
  colorList: [
    "#FF69B4",
    "#FF22B4",
    "#C6A7FF",
    "#7ACCFA",
    "#4898F4",
    "#5061FF",
    "#3DFF7F",
    "#3AE836",
    "#FFEA28",
    "#F9BE26",
    "#FF9518",
    "#FF5018",
    "#FF2F2F",
  ],
};
