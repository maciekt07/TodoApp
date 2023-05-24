import { MenuItem, Select } from "@mui/material";
import { UserProps } from "../types/user";
import { EmojiStyle } from "emoji-picker-react";
import { useState } from "react";

export const UserSettings = ({ user, setUser }: UserProps) => {
  const [name, setName] = useState("");
  const emojiStyles = [
    { label: "Apple", style: EmojiStyle.APPLE },
    { label: "Facebook, Messenger", style: EmojiStyle.FACEBOOK },
    { label: "Twitter, Discord", style: EmojiStyle.TWITTER },
    // { label: "Native", style: EmojiStyle.NATIVE },
    { label: "Google", style: EmojiStyle.GOOGLE },
  ];
  const handleEmojiStyleChange = (event: any) => {
    const selectedEmojiStyle = event.target.value;

    setUser({ ...user, emojisStyle: selectedEmojiStyle });
  };
  return (
    <>
      <Select
        sx={{ color: "white" }}
        value={user.emojisStyle}
        onChange={handleEmojiStyleChange}
      >
        {emojiStyles.map((style) => (
          <MenuItem key={style.style} value={style.style}>
            {style.label}
          </MenuItem>
        ))}
      </Select>
      <br />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={() => setUser({ ...user, name: name })}>
        change name
      </button>
    </>
  );
};
