import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
} from "@mui/material";
import { AppSettings, UserProps } from "../types/user";
import { DialogBtn } from "../styles";
import styled from "@emotion/styled";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { Settings, WifiOff } from "@mui/icons-material";
import { defaultUser } from "../constants/defaultUser";

interface SettingsProps extends UserProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({ open, onClose, user, setUser }: SettingsProps) => {
  const [settings, setSettings] = useState<AppSettings>(user.settings[0]);
  const [lastStyle] = useState<EmojiStyle>(user.emojisStyle);

  const isOnline = useOnlineStatus();

  // Array of available emoji styles with their labels
  const emojiStyles: { label: string; style: EmojiStyle }[] = [
    { label: "Apple", style: EmojiStyle.APPLE },
    { label: "Facebook, Messenger", style: EmojiStyle.FACEBOOK },
    { label: "Twitter, Discord", style: EmojiStyle.TWITTER },
    { label: "Google", style: EmojiStyle.GOOGLE },
    { label: "Native", style: EmojiStyle.NATIVE },
  ];
  // Handler for updating individual setting options
  const handleSettingChange =
    (name: keyof AppSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedSettings = {
        ...settings,
        [name]: event.target.checked,
      };
      setSettings(updatedSettings);
      setUser((prevUser) => ({
        ...prevUser,
        settings: [updatedSettings],
      }));
    };

  // Handler for updating the selected emoji style
  const handleEmojiStyleChange = (event: SelectChangeEvent<EmojiStyle>) => {
    const selectedEmojiStyle = event.target.value as EmojiStyle;
    setUser((prevUser) => ({
      ...prevUser,
      emojisStyle: selectedEmojiStyle,
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: "24px",
          padding: "12px",
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        <Settings />
        &nbsp;Settings
      </DialogTitle>
      <Container>
        {/* Select component to choose the emoji style */}
        <FormGroup>
          <FormControl>
            <FormLabel>Emoji Settings</FormLabel>
            <Select
              value={user.emojisStyle}
              onChange={handleEmojiStyleChange}
              sx={{
                width: "300px",
                borderRadius: "18px",
                color: "black",
                m: "8px 0",
              }}
            >
              {/* Show a disabled menu item when offline, indicating that the style can't be changed */}
              {!isOnline && (
                <MenuItem
                  disabled
                  style={{
                    opacity: 0.8,
                    display: "flex",
                    gap: "6px",
                    fontWeight: 500,
                  }}
                >
                  <WifiOff /> You can't change the emoji style <br /> when you are offline
                </MenuItem>
              )}

              {emojiStyles.map((style) => (
                <MenuItem
                  key={style.style}
                  value={style.style}
                  // Disable non-native styles when offline or if they are not the default style or last selected style
                  // This prevents users from selecting styles that require fetching external resources (emojis) when offline,
                  // as those emojis may not load without an internet connection.
                  disabled={
                    !isOnline &&
                    style.style !== EmojiStyle.NATIVE &&
                    style.style !== defaultUser.emojisStyle &&
                    style.style !== lastStyle
                  }
                  sx={{
                    padding: "12px 20px",
                    borderRadius: "12px",
                    margin: "8px",
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  <Emoji size={24} unified="1f60e" emojiStyle={style.style} />
                  &nbsp;
                  {/* Space For Native Emoji */}
                  {style.style === EmojiStyle.NATIVE && "\u00A0"}
                  {style.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>

        {/* Switch components to control different app settings */}
        <FormGroup>
          <FormLabel>App Settings</FormLabel>
          <FormControlLabel
            sx={{ opacity: settings.enableCategories ? 1 : 0.8 }}
            control={
              <Switch
                checked={settings.enableCategories}
                onChange={handleSettingChange("enableCategories")}
              />
            }
            label="Enable Categories"
          />
        </FormGroup>
        <FormGroup>
          <FormControlLabel
            sx={{ opacity: settings.enableGlow ? 1 : 0.8 }}
            control={
              <Switch checked={settings.enableGlow} onChange={handleSettingChange("enableGlow")} />
            }
            label="Enable Glow Effect"
          />
        </FormGroup>
        <FormGroup>
          <FormControlLabel
            sx={{ opacity: settings.doneToBottom ? 1 : 0.8 }}
            control={
              <Switch
                checked={settings.doneToBottom}
                onChange={handleSettingChange("doneToBottom")}
              />
            }
            label="Move Done Tasks To Bottom"
          />
        </FormGroup>
      </Container>
      <DialogActions>
        <DialogBtn onClick={onClose}>Close</DialogBtn>
      </DialogActions>
    </Dialog>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: left;
  align-items: left;
  flex-direction: column;
  user-select: none;
  margin: 0 18px;
  gap: 6px;
`;
