import React, { useContext, useState } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  Switch,
  Tooltip,
} from "@mui/material";
import { AppSettings } from "../types/user";
import { DialogBtn } from "../styles";
import styled from "@emotion/styled";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { VolumeDown, VolumeOff, VolumeUp, WifiOff } from "@mui/icons-material";
import { defaultUser } from "../constants/defaultUser";
import { UserContext } from "../contexts/UserContext";

interface SettingsProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({ open, onClose }: SettingsProps) => {
  const { user, setUser } = useContext(UserContext);
  const [settings, setSettings] = useState<AppSettings>(user.settings[0]);
  const [lastStyle] = useState<EmojiStyle>(user.emojisStyle);

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceVolume, setVoiceVolume] = useState<number>(user.settings[0].voiceVolume);
  const [prevVoiceVol, setPrevVoiceVol] = useState<number>(user.settings[0].voiceVolume);

  const isOnline = useOnlineStatus();

  // Array of available emoji styles with their labels
  const emojiStyles: { label: string; style: EmojiStyle }[] = [
    { label: "Apple", style: EmojiStyle.APPLE },
    { label: "Facebook, Messenger", style: EmojiStyle.FACEBOOK },
    { label: "Twitter, Discord", style: EmojiStyle.TWITTER },
    { label: "Google", style: EmojiStyle.GOOGLE },
    { label: "Native", style: EmojiStyle.NATIVE },
  ];

  const getAvailableVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    const voiceInfoArray = [];

    for (const voice of voices) {
      if (voice.default) {
        console.log(voice);
      }
      voiceInfoArray.push(voice);
    }

    return voiceInfoArray;
  };

  // Ensure the voices are loaded before calling getAvailableVoices
  window.speechSynthesis.onvoiceschanged = () => {
    const availableVoices = getAvailableVoices();
    setAvailableVoices(availableVoices);
    console.log(availableVoices);
  };

  // Handler for updating individual setting options
  const handleSettingChange =
    (name: keyof AppSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
      // cancel read aloud
      name === "enableReadAloud" && window.speechSynthesis.cancel();
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
  const handleEmojiStyleChange = (event: SelectChangeEvent<unknown>) => {
    const selectedEmojiStyle = event.target.value as EmojiStyle;
    setUser((prevUser) => ({
      ...prevUser,
      emojisStyle: selectedEmojiStyle,
    }));
  };
  const handleVoiceChange = (event: SelectChangeEvent<unknown>) => {
    // Handle the selected voice
    const selectedVoice = availableVoices.find((voice) => voice.name === event.target.value);

    if (selectedVoice) {
      console.log("Selected Voice:", selectedVoice);

      // Update the user settings with the selected voice
      setUser((prevUser) => ({
        ...prevUser,
        settings: [
          {
            ...prevUser.settings[0],
            voice: selectedVoice.name,
          },
        ],
      }));
    }
  };
  // Function to handle changes in voice volume
  const handleVoiceVolChange = (e: Event, value: number | number[]) => {
    e.preventDefault();
    setVoiceVolume(value as number);
    // Update user settings with the new voice volume
    setUser((prevUser) => ({
      ...prevUser,
      settings: [
        {
          ...prevUser.settings[0],
          voiceVolume: value as number,
        },
      ],
    }));
  };

  // Function to handle mute/unmute button click
  const handleMuteClick = () => {
    // Retrieve the current voice volume from user settings
    const vol = voiceVolume;

    // Save the previous voice volume before muting
    setPrevVoiceVol(vol);

    const newVoiceVolume =
      vol === 0 ? (prevVoiceVol !== 0 ? prevVoiceVol : defaultUser.settings[0].voiceVolume) : 0;

    setUser((prevUser) => ({
      ...prevUser,
      settings: [
        {
          ...prevUser.settings[0],
          voiceVolume: newVoiceVolume,
        },
      ],
    }));
    setVoiceVolume(newVoiceVolume);
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
      <DialogTitle sx={{ fontWeight: 600 }}>Settings</DialogTitle>
      <Container>
        {/* Select component to choose the emoji style */}
        <FormGroup>
          <FormControl>
            <FormLabel>Emoji Settings</FormLabel>
            <StyledSelect value={user.emojisStyle} onChange={handleEmojiStyleChange} translate="no">
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
                  translate="no"
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
            </StyledSelect>
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
            sx={{ opacity: settings.enableReadAloud ? 1 : 0.8 }}
            control={
              <Switch
                checked={settings.enableReadAloud}
                onChange={handleSettingChange("enableReadAloud")}
              />
            }
            label="Enable Read Aloud"
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

        {user.settings[0].enableReadAloud && (
          <FormGroup>
            <FormControl>
              <FormLabel>Voice Settings</FormLabel>

              {availableVoices.length !== 0 ? (
                <StyledSelect
                  // Set the value to the first voice in the availableVoices array
                  value={user.settings[0].voice}
                  // Handle the voice selection change
                  onChange={handleVoiceChange}
                  translate="no"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 500,
                        padding: "2px 6px",
                      },
                    },
                  }}
                >
                  {/* Map over available voices to create MenuItem components */}
                  {availableVoices.map((voice) => (
                    <MenuItem
                      key={voice.name}
                      value={voice.name}
                      translate="no"
                      sx={{
                        padding: "10px",
                        borderRadius: "6px",
                      }}
                    >
                      {voice.name} &nbsp;
                      {voice.default && <span style={{ fontWeight: 600 }}>Default</span>}
                    </MenuItem>
                  ))}
                </StyledSelect>
              ) : (
                <NoVoiceStyles>
                  There are no voice styles available. Try to refresh the page.
                  {/* <Emoji emojiStyle={user.emojisStyle} unified="2639-fe0f" size={24} /> */}
                </NoVoiceStyles>
              )}
            </FormControl>

            <Box>
              {/* <Typography sx={{ marginBottom: "2px", marginLeft: "18px", fontSize: "16px" }}>
                Voice Volume
              </Typography> */}

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <VolumeSlider
                  spacing={2}
                  direction="row"
                  sx={
                    {
                      // "@media (max-width: 600px)": {
                      //   width: "180px",
                      //   padding: "8px 18px 8px 9px",
                      // },
                    }
                  }
                  alignItems="center"
                >
                  <Tooltip
                    title={user.settings[0].voiceVolume ? "Mute" : "Unmute"}
                    onClick={handleMuteClick}
                  >
                    <IconButton sx={{ color: "black" }}>
                      {user.settings[0].voiceVolume === 0 ? (
                        <VolumeOff />
                      ) : user.settings[0].voiceVolume <= 0.4 ? (
                        <VolumeDown />
                      ) : (
                        <VolumeUp />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Slider
                    sx={{
                      width: "200px",
                    }}
                    value={voiceVolume}
                    onChange={handleVoiceVolChange}
                    min={0}
                    max={1}
                    step={0.01}
                    aria-label="Volume Slider"
                    valueLabelFormat={() => {
                      const vol = Math.floor(user.settings[0].voiceVolume * 100);
                      return vol === 0 ? "Muted" : vol + "%";
                    }}
                    valueLabelDisplay="auto"
                  />
                </VolumeSlider>
              </div>
            </Box>
          </FormGroup>
        )}
      </Container>

      <DialogActions
      // style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        {/* <span
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            wordBreak: "break-all",
            fontSize: "14px",
            margin: "0 18px",
            gap: "4px",
            opacity: 0.8,
          }}
        >
          Made with <Emoji unified="2764-fe0f" size={14} emojiStyle={user.emojisStyle} />{" "}
          {user.emojisStyle === EmojiStyle.NATIVE && "\u00A0"} by{" "}
          <StyledLink href="https://github.com/maciekt07" target="_blank">
            maciekt07
          </StyledLink>
        </span> */}
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

const StyledSelect = styled(Select)`
  width: 300px;
  border-radius: 18px;
  color: black;
  margin: 8px 0;
`;

const NoVoiceStyles = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.8;
  font-weight: 500;
  max-width: 300px;
`;

const VolumeSlider = styled(Stack)`
  margin: 8px 0;
  background: #afafaf39;
  padding: 12px 24px 12px 18px;
  border-radius: 18px;
  transition: 0.3s all;
  &:hover {
    background: #89898939;
  }
`;
