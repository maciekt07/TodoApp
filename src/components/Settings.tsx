import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
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
import type { AppSettings } from "../types/user";
import { DialogBtn } from "../styles";
import styled from "@emotion/styled";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import {
  CachedRounded,
  DeleteRounded,
  VolumeDown,
  VolumeOff,
  VolumeUp,
  WifiOffRounded,
} from "@mui/icons-material";
import { defaultUser } from "../constants/defaultUser";
import { UserContext } from "../contexts/UserContext";
import { iOS } from "../utils/iOS";
import { showToast } from "../utils";

interface SettingsProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsProps> = ({ open, onClose }) => {
  const { user, setUser } = useContext(UserContext);
  const { settings, emojisStyle } = user;
  const [userSettings, setUserSettings] = useState<AppSettings>(settings[0]);
  const [lastStyle] = useState<EmojiStyle>(emojisStyle);

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceVolume, setVoiceVolume] = useState<number>(settings[0].voiceVolume);
  const [prevVoiceVol, setPrevVoiceVol] = useState<number>(settings[0].voiceVolume);

  const [showLocalVoices, setShowLocalVoices] = useState<boolean>(false);

  const isOnline = useOnlineStatus();

  // Array of available emoji styles with their labels
  const emojiStyles: { label: string; style: EmojiStyle }[] = [
    { label: "Apple", style: EmojiStyle.APPLE },
    { label: "Facebook, Messenger", style: EmojiStyle.FACEBOOK },
    { label: "Twitter, Discord", style: EmojiStyle.TWITTER },
    { label: "Google", style: EmojiStyle.GOOGLE },
    { label: "Native", style: EmojiStyle.NATIVE },
  ];

  const getFlagEmoji = (countryCode: string): string =>
    typeof countryCode === "string"
      ? String.fromCodePoint(
          ...[...countryCode.toUpperCase()].map((x) => 0x1f1a5 + x.charCodeAt(0))
        )
      : "";

  const getAvailableVoices = (): SpeechSynthesisVoice[] => {
    const voices = window.speechSynthesis.getVoices();
    const voiceInfoArray: SpeechSynthesisVoice[] = [];

    for (const voice of voices) {
      voiceInfoArray.push(voice);
    }

    return voiceInfoArray;
  };

  useEffect(() => {
    const availableVoices = getAvailableVoices();
    setAvailableVoices(availableVoices ?? []);
  }, []);

  // Ensure the voices are loaded before calling getAvailableVoices
  window.speechSynthesis.onvoiceschanged = () => {
    const availableVoices = getAvailableVoices();
    setAvailableVoices(availableVoices ?? []);
    // console.log(availableVoices);
  };

  // Handler for updating individual setting options
  const handleSettingChange =
    (name: keyof AppSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
      // cancel read aloud
      if (name === "enableReadAloud") {
        window.speechSynthesis.cancel();
      }

      if (name === "appBadge" && navigator.clearAppBadge && !event.target.checked) {
        navigator.clearAppBadge();
      }

      const updatedSettings = {
        ...userSettings,
        [name]: event.target.checked,
      };
      setUserSettings(updatedSettings);
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
    const selectedVoice = availableVoices.find(
      (voice) => voice.name === (event.target.value as string)
    );
    if (selectedVoice) {
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
  const handleVoiceVolChange = (_event: Event, value: number | number[]) => {
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
  const getLanguageRegion = (lang: string) => {
    if (!lang) {
      // If lang is undefined or falsy, return an empty string
      return "";
    }

    const langParts = lang.split("-");
    if (langParts.length > 1) {
      try {
        return new Intl.DisplayNames([lang], { type: "region" }).of(langParts[1]);
      } catch (error) {
        console.error("Error:", error);
        // Return the language itself if there's an error
        return lang;
      }
    } else {
      // If region is not specified, return the language itself
      return lang;
    }
  };

  const filteredVoices = showLocalVoices
    ? availableVoices.filter((voice) => voice.lang.startsWith(navigator.language))
    : availableVoices;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: 600 }}>Settings</DialogTitle>
      <Container>
        {/* Select component to choose the emoji style */}
        <FormGroup>
          <FormControl>
            <FormLabel>Emoji Settings</FormLabel>
            <StyledSelect value={emojisStyle} onChange={handleEmojiStyleChange} translate="no">
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
                  <WifiOffRounded /> You can't change the emoji style <br /> when you are offline.
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
                    margin: "0 8px",
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
            <Tooltip title="Emoji picker will only show frequently used emojis">
              <FormGroup>
                <StyledFormLabel
                  sx={{ opacity: userSettings.simpleEmojiPicker ? 1 : 0.8 }}
                  control={
                    <Switch
                      checked={userSettings.simpleEmojiPicker}
                      onChange={handleSettingChange("simpleEmojiPicker")}
                    />
                  }
                  label="Simple Emoji Picker"
                />
              </FormGroup>
            </Tooltip>
          </FormControl>
          <Tooltip title="This will delete data about frequently used emojis">
            <Button
              color="error"
              onClick={() => {
                localStorage.removeItem("epr_suggested");
                showToast("Deleted emoji data.");
              }}
            >
              <DeleteRounded /> &nbsp; Clear Emoji Data
            </Button>
          </Tooltip>
        </FormGroup>

        {/* Switch components to control different app settings */}
        <FormGroup>
          <FormLabel>App Settings</FormLabel>
          <StyledFormLabel
            sx={{ opacity: userSettings.enableCategories ? 1 : 0.8 }}
            control={
              <Switch
                checked={userSettings.enableCategories}
                onChange={handleSettingChange("enableCategories")}
              />
            }
            label="Enable Categories"
          />
        </FormGroup>
        <FormGroup>
          <StyledFormLabel
            sx={{ opacity: userSettings.enableGlow ? 1 : 0.8 }}
            control={
              <Switch
                checked={userSettings.enableGlow}
                onChange={handleSettingChange("enableGlow")}
              />
            }
            label="Enable Glow Effect"
          />
        </FormGroup>
        <FormGroup>
          <StyledFormLabel
            sx={{ opacity: userSettings.enableReadAloud ? 1 : 0.8 }}
            control={
              <Switch
                checked={"speechSynthesis" in window && userSettings.enableReadAloud ? true : false}
                onChange={handleSettingChange("enableReadAloud")}
                disabled={"speechSynthesis" in window ? false : true}
              />
            }
            label="Enable Read Aloud"
          />
        </FormGroup>

        {"clearAppBadge" in navigator &&
          window.matchMedia("(display-mode: standalone)").matches && (
            <Tooltip
              title={
                "setAppBadge" in navigator
                  ? "This will show number of not done tasks in app icon if PWA is installed."
                  : "App Badge is not supported"
              }
            >
              <FormGroup>
                <StyledFormLabel
                  sx={{ opacity: userSettings.appBadge ? 1 : 0.8 }}
                  control={
                    <Switch
                      checked={"setAppBadge" in navigator && userSettings.appBadge ? true : false}
                      onChange={handleSettingChange("appBadge")}
                      disabled={"setAppBadge" in navigator ? false : true}
                    />
                  }
                  label="Enable App Badge"
                />
              </FormGroup>
            </Tooltip>
          )}
        <FormGroup>
          <StyledFormLabel
            sx={{ opacity: userSettings.doneToBottom ? 1 : 0.8 }}
            control={
              <Switch
                checked={userSettings.doneToBottom}
                onChange={handleSettingChange("doneToBottom")}
              />
            }
            label="Move Done Tasks To Bottom"
          />
        </FormGroup>

        {settings[0].enableReadAloud && (
          <FormGroup>
            <FormControl>
              <FormLabel>Voice Settings</FormLabel>
              <StyledFormLabel
                sx={{ opacity: showLocalVoices ? 1 : 0.8, maxWidth: "300px" }}
                control={
                  <Switch
                    checked={showLocalVoices}
                    onChange={() => setShowLocalVoices((prev) => !prev)}
                  />
                }
                label={`Local language voices only (${
                  getLanguageRegion(navigator.language) || "?"
                })`}
              />
              {filteredVoices.length !== 0 ? (
                <StyledSelect
                  // Set the value to the first voice in the availableVoices array
                  value={settings[0].voice}
                  variant="outlined"
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
                  {filteredVoices.map((voice) => (
                    <MenuItem
                      key={voice.name}
                      value={voice.name}
                      translate="no"
                      sx={{
                        padding: "10px",
                        borderRadius: "8px",
                      }}
                    >
                      {voice.name} &nbsp;
                      {/* windows does not display flag emotes correctly */}
                      {!/Windows NT 10/.test(navigator.userAgent) ? (
                        <Chip
                          sx={{ fontWeight: 500, padding: "4px" }}
                          label={getLanguageRegion(voice.lang || "")}
                          icon={
                            <span style={{ fontSize: "16px" }}>
                              {getFlagEmoji(voice.lang.split("-")[1] || "")}
                            </span>
                          }
                        />
                      ) : (
                        <span style={{ fontWeight: 500 }}>
                          {getLanguageRegion(voice.lang || "")}
                        </span>
                      )}
                      {voice.default && !iOS && (
                        <span style={{ fontWeight: 600 }}>&nbsp;Default</span>
                      )}
                    </MenuItem>
                  ))}
                </StyledSelect>
              ) : (
                <NoVoiceStyles>
                  There are no voice styles available.
                  <Tooltip title="Refetch voices">
                    <IconButton
                      size="large"
                      onClick={() => {
                        setAvailableVoices(getAvailableVoices() ?? []);
                      }}
                    >
                      <CachedRounded fontSize="large" />
                    </IconButton>
                  </Tooltip>
                </NoVoiceStyles>
              )}
            </FormControl>

            <Box>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <VolumeSlider spacing={2} direction="row" alignItems="center">
                  <Tooltip
                    title={settings[0].voiceVolume ? "Mute" : "Unmute"}
                    onClick={handleMuteClick}
                  >
                    <IconButton sx={{ color: "black" }}>
                      {settings[0].voiceVolume === 0 ? (
                        <VolumeOff />
                      ) : settings[0].voiceVolume <= 0.4 ? (
                        <VolumeDown />
                      ) : (
                        <VolumeUp />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Slider
                    sx={{
                      width: "230px",
                    }}
                    value={voiceVolume}
                    onChange={handleVoiceVolChange}
                    min={0}
                    max={1}
                    step={0.01}
                    aria-label="Volume Slider"
                    valueLabelFormat={() => {
                      const vol = Math.floor(settings[0].voiceVolume * 100);
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

const StyledSelect = styled(Select)`
  width: 330px;
  color: black;
  margin: 8px 0;
`;

const StyledFormLabel = styled(FormControlLabel)`
  max-width: 300px;
`;

const NoVoiceStyles = styled.p`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 6px;
  opacity: 0.8;
  font-weight: 500;
  max-width: 330px;
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
