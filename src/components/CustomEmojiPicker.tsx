import { useState, useEffect, Dispatch, SetStateAction } from "react";
import styled from "@emotion/styled";
import { Avatar, Badge, Tooltip } from "@mui/material";
import { AddReaction, Edit } from "@mui/icons-material";
import EmojiPicker, { Emoji, EmojiStyle } from "emoji-picker-react";
import { getFontColorFromHex } from "../utils";
import { ColorPalette } from "../styles";
import { User } from "../types/user";

interface EmojiPickerProps {
  emoji?: string;
  setEmoji: Dispatch<SetStateAction<string | undefined>>;
  // emojiStyle: EmojiStyle;
  user: User;
  color?: string;
}

export const CustomEmojiPicker = ({
  emoji,
  setEmoji,
  user,
  color,
}: EmojiPickerProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string | undefined>(
    emoji || undefined
  );

  useEffect(() => {
    setEmoji(currentEmoji);
  }, [currentEmoji]);

  useEffect(() => {
    if (emoji === "") {
      setCurrentEmoji(undefined);
    }
  }, [emoji]);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (e: { unified: string }) => {
    setShowEmojiPicker(!showEmojiPicker);
    setCurrentEmoji(e.unified);
  };

  const renderAvatarContent = () => {
    if (emoji || currentEmoji) {
      return user.emojisStyle === EmojiStyle.NATIVE ? (
        <div>
          <Emoji
            size={48}
            emojiStyle={user.emojisStyle}
            unified={currentEmoji || ""}
          />
        </div>
      ) : (
        <Emoji
          size={64}
          emojiStyle={user.emojisStyle}
          unified={currentEmoji || ""}
        />
      );
    } else {
      return (
        <AddReaction
          sx={{
            fontSize: "52px",
            color: color ? getFontColorFromHex(color) : ColorPalette.fontLight,
          }}
        />
      );
    }
  };

  return (
    <>
      <EmojiContainer>
        <Tooltip
          title={
            showEmojiPicker
              ? "Close Emoji Picker"
              : currentEmoji
              ? "Change Emoji"
              : "Choose an Emoji"
          }
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Avatar
                sx={{
                  background: "#9c9c9c81",
                  backdropFilter: "blur(6px)",
                  cursor: "pointer",
                }}
                onClick={toggleEmojiPicker}
              >
                <Edit />
              </Avatar>
            }
          >
            <Avatar
              onClick={toggleEmojiPicker}
              sx={{
                width: "96px",
                height: "96px",
                background: color || ColorPalette.purple,
                // border: `4px solid ${
                //   color ? getFontColorFromHex(color) : "#c0c0c0"
                // }`,
                cursor: "pointer",
              }}
            >
              {renderAvatarContent()}
            </Avatar>
          </Badge>
        </Tooltip>
      </EmojiContainer>
      {showEmojiPicker && (
        <EmojiPickerContainer>
          <EmojiPicker
            emojiStyle={user.emojisStyle}
            autoFocusSearch={false}
            lazyLoadEmojis
            onEmojiClick={handleEmojiClick}
            searchPlaceHolder="Search emoji"
            previewConfig={{
              defaultEmoji: "1f4dd",
              defaultCaption: "Choose the perfect emoji for your task",
            }}
          />
        </EmojiPickerContainer>
      )}
    </>
  );
};

const EmojiContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 14px;
`;

const EmojiPickerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px;
`;
