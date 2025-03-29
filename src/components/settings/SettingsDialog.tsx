import {
  BrightnessAutoRounded,
  CachedRounded,
  CloudOffRounded,
  CloudQueueRounded,
  DarkModeRounded,
  DeleteRounded,
  EmojiEmotionsRounded,
  ExpandMoreRounded,
  Google,
  InfoRounded,
  LightModeRounded,
  Microsoft,
  PaletteRounded,
  PersonalVideoRounded,
  RecordVoiceOverRounded,
  SettingsRounded,
  StopCircleRounded,
  VolumeDown,
  VolumeOff,
  VolumeUp,
} from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Link,
  MenuItem,
  SelectChangeEvent,
  Slider,
  Tabs,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useContext, useEffect, useState } from "react";
import { CustomDialogTitle, TabGroupProvider, TabPanel } from "..";
import { defaultUser } from "../../constants/defaultUser";
import { UserContext } from "../../contexts/UserContext";
import { useResponsiveDisplay } from "../../hooks/useResponsiveDisplay";
import { useSystemTheme } from "../../hooks/useSystemTheme";
import { ColorElement } from "../../styles";
import { Themes } from "../../theme/createTheme";
import type { AppSettings, DarkModeOptions } from "../../types/user";
import { getFontColor, showToast, systemInfo } from "../../utils";
import CustomRadioGroup from "./CustomRadioGroup";
import CustomSwitch from "./CustomSwitch";
import {
  NoVoiceStyles,
  SectionDescription,
  SectionHeading,
  StyledListSubheader,
  StyledMenuItem,
  StyledSelect,
  StyledTab,
  TabHeading,
  VolumeSlider,
} from "./settingsDialog.styled";
import type { OptionItem } from "./settingsTypes";
import baner from "../../assets/baner.png";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

const OPTION_ICON_SIZE = 32;

const darkModeOptions: OptionItem<DarkModeOptions>[] = [
  {
    label: "Auto",
    value: "auto",
    icon: <BrightnessAutoRounded sx={{ fontSize: OPTION_ICON_SIZE }} />,
  },
  {
    label: "System",
    value: "system",
    icon: <PersonalVideoRounded sx={{ fontSize: OPTION_ICON_SIZE }} />,
  },
  {
    label: "Light",
    value: "light",
    icon: <LightModeRounded sx={{ fontSize: OPTION_ICON_SIZE }} />,
  },
  {
    label: "Dark",
    value: "dark",
    icon: <DarkModeRounded sx={{ fontSize: OPTION_ICON_SIZE }} />,
  },
];

const emojiStyles: OptionItem<EmojiStyle>[] = [
  { label: "Apple", value: EmojiStyle.APPLE },
  { label: "Facebook", value: EmojiStyle.FACEBOOK },
  { label: "Discord", value: EmojiStyle.TWITTER },
  { label: "Google", value: EmojiStyle.GOOGLE },
  { label: "Native", value: EmojiStyle.NATIVE },
].map(({ label, value }) => ({
  label,
  value,
  icon: <Emoji emojiStyle={value} unified="1f60e" size={OPTION_ICON_SIZE} />,
}));

interface SettingsProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({ open, onClose }: SettingsProps) => {
  const { user, setUser } = useContext(UserContext);

  const [tabValue, setTabValue] = useState<number>(0);

  const [darkModeValue, setDarkModeValue] = useState<DarkModeOptions>(user.darkmode);
  const [emojiStyleValue, setEmojiStyleValue] = useState<EmojiStyle>(user.emojisStyle);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceVolume, setVoiceVolume] = useState<number>(user.settings.voiceVolume);
  const [prevVoiceVol, setPrevVoiceVol] = useState<number>(user.settings.voiceVolume);
  const [isSampleReading, setIsSampleReading] = useState<boolean>(false);

  const isMobile = useResponsiveDisplay();
  const muiTheme = useTheme();
  const systemTheme = useSystemTheme();
  const isOnline = useOnlineStatus();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const themeColorMeta = document.querySelector("meta[name=theme-color]");
    const defaultThemeColor = muiTheme.palette.secondary.main;

    if (themeColorMeta) {
      if (open) {
        themeColorMeta.setAttribute(
          "content",
          muiTheme.palette.mode === "dark" ? "#383838" : "#ffffff",
        );
      } else {
        themeColorMeta.setAttribute("content", defaultThemeColor);
      }
    }
  }, [muiTheme.palette.mode, muiTheme.palette.secondary.main, open, user.theme, user.darkmode]);

  // Cancel speech synthesis when the voice settings are changed
  useEffect(() => {
    setIsSampleReading(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [user.settings.voiceVolume, user.settings.voice]);

  const handleDialogClose = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSampleReading(false);
    onClose();
  };

  const handleAppThemeChange = (event: SelectChangeEvent<unknown>) => {
    const selectedTheme = event.target.value as string;
    setUser((prevUser) => ({
      ...prevUser,
      theme: selectedTheme,
    }));
  };

  // Function to get the available speech synthesis voices
  // https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
  const getAvailableVoices = (): SpeechSynthesisVoice[] => {
    if (!window.speechSynthesis) {
      return [];
    }
    const voices = window.speechSynthesis.getVoices() ?? [];
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
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
      const availableVoices = getAvailableVoices();
      setAvailableVoices(availableVoices ?? []);
    };
  }

  const handleVoiceChange = (event: SelectChangeEvent<unknown>) => {
    const voice = event.target.value as AppSettings["voice"];
    if (voice) {
      // Update the user settings with the selected voice
      setUser((prevUser) => ({
        ...prevUser,
        settings: {
          ...prevUser.settings,
          voice,
        },
      }));
    }
  };

  const filteredVoices: SpeechSynthesisVoice[] = availableVoices
    .filter(
      // remove duplicate voices as iOS/macOS tend to duplicate them for some reason
      (value, index, self) =>
        index ===
        self.findIndex(
          (v) =>
            v.lang === value.lang &&
            v.default === value.default &&
            v.localService === value.localService &&
            v.name === value.name &&
            v.voiceURI === value.voiceURI,
        ),
    )
    .sort((a, b) => {
      // prioritize voices matching user language
      const aIsFromCountry = a.lang.startsWith(navigator.language);
      const bIsFromCountry = b.lang.startsWith(navigator.language);

      if (aIsFromCountry && !bIsFromCountry) {
        return -1;
      }
      if (!aIsFromCountry && bIsFromCountry) {
        return 1;
      }

      // If both or neither match navigator.language, sort alphabetically by lang
      return a.lang.localeCompare(b.lang);
    });

  const getLanguageRegion = (lang: string) => {
    if (!lang) {
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

  // Function to handle changes in voice volume after mouse up
  const handleVoiceVolCommitChange = (
    _event: Event | React.SyntheticEvent<Element, Event>,
    value: number | number[],
  ) => {
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

  const getFlagUnicodes = (countryCode: string): string => {
    // get the last part of the country code (PL from pl-PL)
    const region = countryCode.split("-").pop()?.toUpperCase().slice(0, 2);

    if (!region || region.length !== 2) {
      throw new Error("Invalid country code format");
    }
    // convert each letter into a regional indicator symbol
    const [codePointA, codePointB] = [...region].map((char) => char.charCodeAt(0) - 0x41 + 0x1f1e6);

    return `${codePointA.toString(16)}-${codePointB.toString(16)}`;
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      slotProps={{
        paper: {
          style: {
            padding: isMobile ? "12px 0" : "12px",
            borderRadius: isMobile ? 0 : "24px",
            minWidth: "400px",
            maxHeight: isMobile ? undefined : "500px",
            overflow: "hidden",
          },
        },
      }}
    >
      <CustomDialogTitle
        icon={<SettingsRounded />}
        title="Settings"
        subTitle="Manage Your settings and preferences"
        onClose={handleDialogClose}
        removeDivider
      />
      <Divider sx={{ mb: 2 }} />
      <DialogContent sx={{ display: "flex", minHeight: 400, m: 0, p: 0, overflow: "hidden" }}>
        <Tabs
          orientation="vertical"
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          aria-label="Settings tabs"
          sx={{
            borderRight: 1,
            borderColor: "divider",
          }}
        >
          {[
            { icon: <PaletteRounded />, label: "Appearance" },
            { icon: <SettingsRounded />, label: "General" },
            { icon: <EmojiEmotionsRounded />, label: "Emoji" },
            { icon: <RecordVoiceOverRounded />, label: "Read Aloud" },
            { icon: <InfoRounded />, label: "About" },
          ].map((tab, index) => (
            <StyledTab icon={tab.icon} label={tab.label} {...a11yProps(index)} key={index} />
          ))}
        </Tabs>
        <Box
          className="customScrollbar"
          sx={{ flex: 1, p: 0, m: isMobile ? "0 12px" : "0 20px 0 20px", overflowY: "auto" }}
        >
          <TabGroupProvider name="settings">
            <TabPanel value={tabValue} index={0}>
              <TabHeading>Appearance</TabHeading>
              <SectionHeading>Dark Mode Options</SectionHeading>
              <CustomRadioGroup
                options={darkModeOptions}
                value={darkModeValue}
                onChange={(val) => {
                  setDarkModeValue(val);
                  setUser((prevUser) => ({
                    ...prevUser,
                    darkmode: val,
                  }));
                }}
              />
              <SectionHeading>Theme Selection</SectionHeading>
              <StyledSelect
                value={user.theme}
                onChange={handleAppThemeChange}
                IconComponent={ExpandMoreRounded}
              >
                <StyledMenuItem value="system">
                  <PersonalVideoRounded />
                  &nbsp; System ({systemTheme === "dark" ? Themes[0].name : Themes[1].name})
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
              <CustomSwitch
                settingKey="enableGlow"
                header="Enable Glow Effect"
                text="Activate a subtle glow effect on tasks to make them more visually"
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <TabHeading>General Settings</TabHeading>
              <CustomSwitch
                settingKey="enableCategories"
                header="Enable Categories"
                text="
              Enable categories to organize your tasks. Disabling this will remove all categories and
              ungroup your tasks."
              />
              <CustomSwitch
                settingKey="appBadge"
                header="App Badge"
                text="Show a badge on the PWA icon to indicate the number of not done tasks."
              />
              <CustomSwitch
                settingKey="doneToBottom"
                header="Completed Tasks at Bottom"
                text="Move completed tasks to the bottom of the list to keep your active tasks more visible."
              />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <TabHeading>Emoji Settings</TabHeading>
              <SectionHeading>Emoji Style</SectionHeading>
              <CustomRadioGroup
                options={emojiStyles}
                value={emojiStyleValue}
                onChange={(val) => {
                  setEmojiStyleValue(val);
                  setUser((prevUser) => ({
                    ...prevUser,
                    emojisStyle: val,
                  }));
                }}
              />
              <SectionHeading>Simple Emoji Picker</SectionHeading>
              <CustomSwitch
                settingKey="simpleEmojiPicker"
                header="Enable simple emoji picker"
                text="
              Use a simple emoji picker with only recently used emojis. This will make the emoji picker load faster."
              />

              <SectionHeading>Emoji Data</SectionHeading>
              <SectionDescription> Clear data about recently used emojis</SectionDescription>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  localStorage.removeItem("epr_suggested");
                  showToast("Removed emoji data.");
                }}
              >
                <DeleteRounded /> &nbsp; Clear Emoji Data
              </Button>
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <TabHeading>Read Aloud Settings</TabHeading>
              {!("speechSynthesis" in window) && (
                <Alert severity="error">
                  <AlertTitle>Speech Synthesis Not Supported</AlertTitle>
                  Your browser does not support built in text-to-speech.
                </Alert>
              )}
              <SectionHeading>Play Sample</SectionHeading>
              <Button
                variant="contained"
                disabled={!("speechSynthesis" in window)}
                sx={{ color: getFontColor(muiTheme.palette.primary.main), mt: "8px" }}
                onClick={() => {
                  if (!("speechSynthesis" in window)) return;
                  window.speechSynthesis.cancel();
                  if (isSampleReading) {
                    window.speechSynthesis.pause();
                  } else {
                    const textToRead =
                      "This is a sample text for testing the speech synthesis feature.";
                    const utterance = new SpeechSynthesisUtterance(textToRead);
                    const voices = window.speechSynthesis.getVoices() ?? [];
                    utterance.voice =
                      voices.find((voice) => voice.name === user.settings.voice.split("::")[0]) ||
                      voices[0];
                    utterance.volume = voiceVolume;
                    utterance.rate = 1;
                    utterance.onend = () => {
                      setIsSampleReading(false);
                    };
                    window.speechSynthesis.speak(utterance);
                  }
                  setIsSampleReading((prev) => !prev);
                }}
              >
                {isSampleReading ? <StopCircleRounded /> : <RecordVoiceOverRounded />} &nbsp; Play
                Sample
              </Button>
              <SectionHeading>Voice Selection</SectionHeading>
              {filteredVoices.length !== 0 ? (
                <StyledSelect
                  value={user.settings.voice}
                  variant="outlined"
                  disabled={!("speechSynthesis" in window)}
                  onChange={handleVoiceChange}
                  translate="no"
                  IconComponent={ExpandMoreRounded}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 500,
                        padding: "0px 6px",
                      },
                    },
                  }}
                >
                  {(() => {
                    // group voices by language match
                    const matchingLanguageVoices = filteredVoices.filter((voice) =>
                      voice.lang.startsWith(navigator.language),
                    );
                    const otherVoices = filteredVoices.filter(
                      (voice) => !voice.lang.startsWith(navigator.language),
                    );

                    // function to render a voice item consistently
                    const renderVoiceItem = (voice: SpeechSynthesisVoice) => (
                      <MenuItem
                        key={`${voice.name}::${voice.lang}`}
                        value={`${voice.name}::${voice.lang}`}
                        translate="no"
                        disabled={voice.localService === false && !isOnline}
                        sx={{ padding: "10px", borderRadius: "8px" }}
                      >
                        {voice.name.startsWith("Google") && <Google sx={{ mr: "8px" }} />}
                        {voice.name.startsWith("Microsoft") && <Microsoft sx={{ mr: "8px" }} />}
                        {voice.name.replace(/^(Google|Microsoft)\s*|\([^()]*\)/gi, "")}
                        <Chip
                          sx={{ fontWeight: 500, padding: "4px", ml: "8px" }}
                          label={getLanguageRegion(voice.lang || "")}
                          icon={
                            <span
                              style={{ fontSize: "16px", alignItems: "center", display: "flex" }}
                            >
                              <Emoji
                                unified={getFlagUnicodes(voice.lang)}
                                emojiStyle={user.emojisStyle}
                                size={18}
                              />
                            </span>
                          }
                        />
                        {voice.default && systemInfo.os !== "iOS" && systemInfo.os !== "macOS" && (
                          <span style={{ fontWeight: 600 }}>&nbsp; Default</span>
                        )}
                        {voice.localService === false && (
                          <span
                            style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
                          >
                            {!isOnline ? (
                              <CloudOffRounded sx={{ fontSize: "18px" }} />
                            ) : (
                              <Tooltip title="Requires Internet Connection" placement="left">
                                <CloudQueueRounded sx={{ fontSize: "18px" }} />
                              </Tooltip>
                            )}
                          </span>
                        )}
                      </MenuItem>
                    );

                    // create voice groups with headers
                    const createVoiceGroup = (
                      voices: SpeechSynthesisVoice[],
                      headerText: string,
                      headerId: string,
                    ) => {
                      if (voices.length === 0) return [];

                      return [
                        <StyledListSubheader key={headerId}>{headerText}</StyledListSubheader>,
                        ...voices.map(renderVoiceItem),
                      ];
                    };

                    // return all menu items
                    return [
                      ...createVoiceGroup(
                        matchingLanguageVoices,
                        `Your Language (${getLanguageRegion(navigator.language)})`,
                        "header-matching",
                      ),
                      ...createVoiceGroup(otherVoices, "Other Languages", "header-other"),
                    ];
                  })()}
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
              {!isOnline && availableVoices.some((voice) => voice.localService === false) && (
                <Alert severity="warning" sx={{ mt: "8px" }}>
                  <AlertTitle>Offline Mode</AlertTitle>
                  You are currently offline. Some Voices may require an internet connection to work.
                </Alert>
              )}
              <SectionHeading>Voice Volume</SectionHeading>
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
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <TabHeading>About Todo App</TabHeading>
              <Typography variant="body1" sx={{ mb: 2 }}>
                📝 A simple todo app project made using React.js and MUI with many features,
                including sharing tasks via link, theme customization and offline usage as a PWA.
              </Typography>
              <img
                src={baner}
                style={{ width: "100%", height: "auto" }}
                alt="Todo App Screenshot"
              />
              <Typography variant="caption" sx={{ display: "block", mt: 2 }}>
                Created by <Link href="https://github.com/maciekt07">maciekt07</Link> <br />
                Explore the project on GitHub:{" "}
                <Link
                  href="https://github.com/maciekt07/TodoApp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Todo App Repository
                </Link>
              </Typography>
            </TabPanel>
          </TabGroupProvider>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}
