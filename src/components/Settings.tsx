import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import {
  BrightnessAutoRounded,
  CachedRounded,
  DarkModeRounded,
  DeleteRounded,
  ExpandMoreRounded,
  Google,
  LightModeRounded,
  Microsoft,
  PersonalVideoRounded,
  SettingsRounded,
  VolumeDown,
  VolumeOff,
  VolumeUp,
  WifiOffRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
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
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useContext, useEffect, useState } from "react";
import { defaultUser } from "../constants/defaultUser";
import { UserContext } from "../contexts/UserContext";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { useSystemTheme } from "../hooks/useSystemTheme";
import { ColorElement, DialogBtn } from "../styles";
import { Themes } from "../theme/createTheme";
import type { AppSettings, DarkModeOptions } from "../types/user";
import { isDark, showToast, systemInfo } from "../utils";
import { CustomDialogTitle } from "./DialogTitle";

interface SettingsProps {
  open: boolean;
  onClose: () => void;
}

//TODO: Redesign settings component to have tabs on the left side

export const SettingsDialog: React.FC<SettingsProps> = ({ open, onClose }) => {
  const { user, setUser } = useContext(UserContext);
  const { settings, emojisStyle, darkmode } = user;
  const [userSettings, setUserSettings] = useState<AppSettings>(settings);
  const [lastStyle] = useState<EmojiStyle>(emojisStyle);

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceVolume, setVoiceVolume] = useState<number>(settings.voiceVolume);
  const [prevVoiceVol, setPrevVoiceVol] = useState<number>(settings.voiceVolume);
  const [showLocalVoices, setShowLocalVoices] = useState<boolean>(false);

  const [storageUsage, setStorageUsage] = useState<number | undefined>(undefined);

  const isOnline = useOnlineStatus();
  const systemTheme = useSystemTheme();
  const theme = useTheme();

  // Array of available emoji styles with their labels
  const emojiStyles: { label: string; style: EmojiStyle }[] = [
    { label: "Apple", style: EmojiStyle.APPLE },
    { label: "Facebook, Messenger", style: EmojiStyle.FACEBOOK },
    { label: "Twitter, Discord", style: EmojiStyle.TWITTER },
    { label: "Google", style: EmojiStyle.GOOGLE },
    { label: "Native", style: EmojiStyle.NATIVE },
  ];

  // Array of available dark mode options
  const darkModeOptions: {
    label: string;
    mode: DarkModeOptions;
    icon: JSX.Element;
  }[] = [
    {
      label: "Auto",
      mode: "auto",
      icon: <BrightnessAutoRounded />,
    },
    {
      label: "System",
      mode: "system",
      icon: <PersonalVideoRounded />,
    },
    {
      label: "Light",
      mode: "light",
      icon: <LightModeRounded />,
    },
    {
      label: "Dark",
      mode: "dark",
      icon: <DarkModeRounded />,
    },
  ];

  // function to get the flag emoji for a given country code
  const getFlagEmoji = (countryCode: string): string =>
    typeof countryCode === "string"
      ? String.fromCodePoint(
          ...[...countryCode.toUpperCase()].map((x) => 0x1f1a5 + x.charCodeAt(0)),
        )
      : "";

  // Function to get the available speech synthesis voices
  // https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
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

    const getStorageUsage = async () => {
      const storageUsage = await navigator.storage.estimate();
      setStorageUsage(storageUsage.usage);
    };
    getStorageUsage();
  }, []);

  // Ensure the voices are loaded before calling getAvailableVoices
  window.speechSynthesis.onvoiceschanged = () => {
    const availableVoices = getAvailableVoices();
    setAvailableVoices(availableVoices ?? []);
  };

  // Handler for updating individual setting options
  const handleSettingChange =
    (name: keyof AppSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      // cancel read aloud
      if (name === "enableReadAloud") {
        window.speechSynthesis.cancel();
      }
      if (name === "appBadge" && navigator.clearAppBadge && !isChecked) {
        navigator.clearAppBadge();
      }
      const updatedSettings: AppSettings = {
        ...userSettings,
        voice: settings.voice, // Bug fix: reset voice to default when changing other settings
        [name]: isChecked,
      };
      setUserSettings(updatedSettings);
      setUser((prevUser) => ({
        ...prevUser,
        settings: updatedSettings,
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

  const handleDarkModeChange = (event: SelectChangeEvent<unknown>) => {
    const selectedDarkMode = event.target.value as DarkModeOptions;
    setUser((prevUser) => ({
      ...prevUser,
      darkmode: selectedDarkMode,
    }));
  };

  const handleVoiceChange = (event: SelectChangeEvent<unknown>) => {
    // Handle the selected voice
    const selectedVoice = availableVoices.find(
      (voice) => voice.name === (event.target.value as string),
    );
    if (selectedVoice) {
      // Update the user settings with the selected voice
      setUser((prevUser) => ({
        ...prevUser,
        settings: {
          ...prevUser.settings,
          voice: selectedVoice.name,
        },
      }));
    }
  };

  // Function to handle changes in voice volume after mouse up
  const handleVoiceVolCommitChange = (
    _event: Event | React.SyntheticEvent<Element, Event>,
    value: number | number[],
  ) => {
    // Update user settings with the new voice volume
    setUser((prevUser) => ({
      ...prevUser,
      settings: {
        ...prevUser.settings,
        voiceVolume: value as number,
      },
    }));
  };

  // Function to handle mute/unmute button click
  const handleMuteClick = () => {
    // Retrieve the current voice volume from user settings
    const vol = voiceVolume;
    // Save the previous voice volume before muting
    setPrevVoiceVol(vol);
    const newVoiceVolume =
      vol === 0 ? (prevVoiceVol !== 0 ? prevVoiceVol : defaultUser.settings.voiceVolume) : 0;
    setUser((prevUser) => ({
      ...prevUser,
      settings: {
        ...prevUser.settings,
        voiceVolume: newVoiceVolume,
      },
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

  const filteredVoices: SpeechSynthesisVoice[] = showLocalVoices
    ? availableVoices.filter((voice) => voice.lang.startsWith(navigator.language))
    : availableVoices;

  const handleAppThemeChange = (event: SelectChangeEvent<unknown>) => {
    const selectedTheme = event.target.value as string;
    setUser((prevUser) => ({
      ...prevUser,
      theme: selectedTheme,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <CustomDialogTitle
        title="Settings"
        subTitle="Manage your settings and preferences."
        icon={<SettingsRounded />}
        onClose={onClose}
      />
      <Container>
        <FormGroup>
          <FormControl>
            <FormLabel>Dark Mode</FormLabel>
            <StyledSelect
              value={darkmode}
              onChange={handleDarkModeChange}
              IconComponent={ExpandMoreRounded}
            >
              {darkModeOptions.map((option) => (
                <StyledMenuItem key={option.mode} value={option.mode}>
                  {option.icon}&nbsp;{option.label}
                  {option.mode === "system" && ` (${systemTheme})`}
                  {option.mode === "auto" && ` (${isDark(theme.secondary) ? "dark" : "light"})`}
                </StyledMenuItem>
              ))}
            </StyledSelect>
          </FormControl>
        </FormGroup>

        <FormGroup>
          <FormControl>
            <FormLabel>App Theme</FormLabel>
            <StyledSelect
              value={user.theme}
              onChange={handleAppThemeChange}
              IconComponent={ExpandMoreRounded}
            >
              <StyledMenuItem value="system">
                <PersonalVideoRounded />
                &nbsp; System ({systemTheme})
              </StyledMenuItem>
              {Themes.map((theme) => (
                <StyledMenuItem key={theme.name} value={theme.name}>
                  <ColorElement
                    clr={theme.MuiTheme.palette.primary.main}
                    secondClr={theme.MuiTheme.palette.secondary.main}
                    aria-label={`Change theme - ${theme.name}`}
                    size="24px"
                    disableHover
                  />
                  &nbsp;
                  {theme.name}
                </StyledMenuItem>
              ))}
            </StyledSelect>
          </FormControl>
        </FormGroup>

        <FormGroup>
          <FormControl>
            <FormLabel>Emoji Settings</FormLabel>
            <StyledSelect
              value={emojisStyle}
              onChange={handleEmojiStyleChange}
              translate="no"
              IconComponent={ExpandMoreRounded}
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
                  <WifiOffRounded /> You can't change the emoji style <br /> when you are offline.
                </MenuItem>
              )}

              {emojiStyles.map((style) => (
                <StyledMenuItem
                  key={style.style}
                  value={style.style}
                  translate="no"
                  disabled={
                    !isOnline &&
                    style.style !== EmojiStyle.NATIVE &&
                    style.style !== defaultUser.emojisStyle &&
                    style.style !== lastStyle
                  }
                >
                  <Emoji size={24} unified="1f60e" emojiStyle={style.style} />
                  &nbsp;
                  {/* Space For Native Emoji */}
                  {style.style === EmojiStyle.NATIVE && "\u00A0"}
                  {style.label}
                </StyledMenuItem>
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
              variant="outlined"
              sx={{ my: "12px", p: "12px", borderRadius: "18px" }}
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

        {settings.enableReadAloud && (
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
                  value={settings.voice}
                  variant="outlined"
                  onChange={handleVoiceChange}
                  translate="no"
                  IconComponent={ExpandMoreRounded}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 500,
                        padding: "2px 6px",
                      },
                    },
                  }}
                >
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
                      {voice.name.startsWith("Google") && <Google />}
                      {voice.name.startsWith("Microsoft") && <Microsoft />} &nbsp;{" "}
                      {/* Remove Google or Microsoft at the beginning and anything within parentheses */}
                      {voice.name.replace(/^(Google|Microsoft)\s*|\([^()]*\)/gi, "")} &nbsp;
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
                      {voice.default && systemInfo.os !== "iOS" && systemInfo.os !== "macOS" && (
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
                  <Tooltip title={voiceVolume ? "Mute" : "Unmute"} onClick={handleMuteClick}>
                    <IconButton>
                      {voiceVolume === 0 ? (
                        <VolumeOff />
                      ) : voiceVolume <= 0.4 ? (
                        <VolumeDown />
                      ) : (
                        <VolumeUp />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Slider
                    sx={{
                      width: "100%",
                    }}
                    value={voiceVolume}
                    onChange={(_event, value) => setVoiceVolume(value as number)}
                    onChangeCommitted={handleVoiceVolCommitChange}
                    min={0}
                    max={1}
                    step={0.01}
                    aria-label="Volume Slider"
                    valueLabelFormat={() => {
                      const vol = Math.floor(voiceVolume * 100);
                      return vol === 0 ? "Muted" : vol + "%";
                    }}
                    valueLabelDisplay="auto"
                  />
                </VolumeSlider>
              </div>
            </Box>
          </FormGroup>
        )}
        {storageUsage !== undefined && storageUsage !== 0 && (
          <FormGroup>
            <FormLabel>Storage Usage</FormLabel>
            <div>{storageUsage ? `${(storageUsage / 1024 / 1024).toFixed(2)} MB` : "0 MB"}</div>
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
  width: 360px;
  margin: 8px 0;
`;

const StyledMenuItem = styled(MenuItem)`
  padding: 12px 20px;
  border-radius: 12px;
  margin: 0 8px;
  display: flex;
  gap: 6px;
`;

const StyledFormLabel = styled(FormControlLabel)`
  max-width: 360px;
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
  width: 100%;
`;
