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
import { WifiOff } from "@mui/icons-material";
import { defaultUser } from "../constants/defaultUser";

interface SettingsProps extends UserProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({
  open,
  onClose,
  user,
  setUser,
}: SettingsProps) => {
  const [settings, setSettings] = useState(user.settings[0]);
  const [lastStyle] = useState<EmojiStyle>(user.emojisStyle);

  const isOnline = useOnlineStatus();

  const emojiStyles: { label: string; style: EmojiStyle }[] = [
    { label: "Apple", style: EmojiStyle.APPLE },
    { label: "Facebook, Messenger", style: EmojiStyle.FACEBOOK },
    { label: "Twitter, Discord", style: EmojiStyle.TWITTER },
    { label: "Google", style: EmojiStyle.GOOGLE },
    { label: "Native", style: EmojiStyle.NATIVE },
  ];

  const handleSettingChange =
    (name: keyof AppSettings) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleEmojiStyleChange = (event: SelectChangeEvent<EmojiStyle>) => {
    const selectedEmojiStyle = event.target.value as EmojiStyle;
    setUser({ ...user, emojisStyle: selectedEmojiStyle });
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
      <DialogTitle>Settings</DialogTitle>
      <Container>
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
                  <WifiOff /> You can't change the emoji style <br /> when you
                  are offline
                </MenuItem>
              )}
              {emojiStyles.map((style) => (
                <MenuItem
                  key={style.style}
                  value={style.style}
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
                  {style.style === EmojiStyle.NATIVE && "\u00A0"}
                  {style.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>
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
              <Switch
                checked={settings.enableGlow}
                onChange={handleSettingChange("enableGlow")}
              />
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

// const Beta = styled.span`
//   background: #0e8e0e;
//   color: #00ff00;
//   font-size: 12px;
//   letter-spacing: 0.03em;
//   padding: 2px 6px;
//   border-radius: 5px;
//   font-weight: 600;
//   box-shadow: 0 0 4px 0 #0e8e0e91;
// `;
