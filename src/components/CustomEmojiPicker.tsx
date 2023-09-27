import { useState, useEffect, Dispatch, SetStateAction, CSSProperties } from "react";
import styled from "@emotion/styled";
import { Avatar, Badge, Tooltip } from "@mui/material";
import { AddReaction, Edit } from "@mui/icons-material";
import EmojiPicker, { Emoji, EmojiClickData, EmojiStyle } from "emoji-picker-react";
import { getFontColorFromHex } from "../utils";
import { ColorPalette } from "../styles";
import { User } from "../types/user";

interface EmojiPickerProps {
  emoji?: string;
  setEmoji: Dispatch<SetStateAction<string | undefined>>;
  user: User;
  color?: string;
  width?: CSSProperties["width"];
}

export const CustomEmojiPicker = ({ emoji, setEmoji, user, color, width }: EmojiPickerProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const [currentEmoji, setCurrentEmoji] = useState<string | undefined>(emoji || undefined);

  // When the currentEmoji state changes, update the parent component's emoji state
  useEffect(() => {
    setEmoji(currentEmoji);
  }, [currentEmoji]);

  // When the emoji prop changes to an empty string, set the currentEmoji state to undefined
  useEffect(() => {
    if (emoji === "") {
      setCurrentEmoji(undefined);
    }
  }, [emoji]);

  // Function to toggle the visibility of the EmojiPicker
  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prevState) => !prevState);
  };

  // Handler function for when an emoji is clicked in the EmojiPicker
  const handleEmojiClick = (e: EmojiClickData) => {
    toggleEmojiPicker();
    setCurrentEmoji(e.unified);
    console.log(e);
  };

  // Function to render the content of the Avatar based on whether an emoji is selected or not
  const renderAvatarContent = () => {
    if (currentEmoji) {
      // Determine the size of the emoji based on the user's emoji style preference
      const emojiSize = user.emojisStyle === EmojiStyle.NATIVE ? 48 : 64;
      return (
        <div>
          <Emoji size={emojiSize} emojiStyle={user.emojisStyle} unified={currentEmoji} />
        </div>
      );
    } else {
      // If no emoji is selected, show the AddReaction icon with the specified color or default purple
      const fontColor = color ? getFontColorFromHex(color) : ColorPalette.fontLight;
      return (
        <AddReaction
          sx={{
            fontSize: "52px",
            color: fontColor,
            transition: ".3s all",
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
                transition: ".3s all",
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
            width={width || "350px"}
            height="500px"
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
