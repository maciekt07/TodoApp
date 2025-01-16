import styled from "@emotion/styled";
import {
  BrightnessAutoRounded,
  CachedRounded,
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
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  Slider,
  Stack,
  Tab,
  TabProps,
  Tabs,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useContext, useEffect, useState } from "react";
import { CustomDialogTitle } from "..";
import { UserContext } from "../../contexts/UserContext";
import CustomRadioGroup from "./CustomRadioGroup";
import { useResponsiveDisplay } from "../../hooks/useResponsiveDisplay";
import { useSystemTheme } from "../../hooks/useSystemTheme";
import type { OptionItem } from "./settingsTypes";
import { ColorElement } from "../../styles";
import { Themes } from "../../theme/createTheme";
import type { DarkModeOptions } from "../../types/user";
import { showToast, systemInfo } from "../../utils";
import CustomSwitch from "./CustomSwitch";
import { defaultUser } from "../../constants/defaultUser";

const darkModeOptions: OptionItem<DarkModeOptions>[] = [
  {
    label: "Auto",
    value: "auto",
    icon: <BrightnessAutoRounded sx={{ fontSize: "32px" }} />,
  },
  {
    label: "System",
    value: "system",
    icon: <PersonalVideoRounded sx={{ fontSize: "32px" }} />,
  },
  {
    label: "Light",
    value: "light",
    icon: <LightModeRounded sx={{ fontSize: "32px" }} />,
  },
  {
    label: "Dark",
    value: "dark",
    icon: <DarkModeRounded sx={{ fontSize: "32px" }} />,
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
  icon: <Emoji emojiStyle={value} unified="1f60e" size={32} />,
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

  const handleAppThemeChange = (event: SelectChangeEvent<unknown>) => {
    const selectedTheme = event.target.value as string;
    setUser((prevUser) => ({
      ...prevUser,
      theme: selectedTheme,
    }));
  };

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

    // const getStorageUsage = async () => {
    //   const storageUsage = await navigator.storage.estimate();
    //   setStorageUsage(storageUsage.usage);
    // };
    // getStorageUsage();
  }, []);

  // Ensure the voices are loaded before calling getAvailableVoices
  window.speechSynthesis.onvoiceschanged = () => {
    const availableVoices = getAvailableVoices();
    setAvailableVoices(availableVoices ?? []);
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

  const filteredVoices = availableVoices.sort(
    (a, b) =>
      Number(b.lang.startsWith(navigator.language)) - Number(a.lang.startsWith(navigator.language)),
  );
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        style: {
          padding: isMobile ? "12px 0" : "12px",
          borderRadius: isMobile ? 0 : "24px",
          minWidth: "400px",
          maxHeight: isMobile ? undefined : "500px",
          overflow: "hidden",
        },
      }}
    >
      <CustomDialogTitle
        icon={<SettingsRounded />}
        title="Settings"
        subTitle="Manage Your settings and preferences"
        onClose={onClose}
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
            <SectionHeading>Play Sample</SectionHeading>
            <Button
              variant="contained"
              onClick={() => {
                window.speechSynthesis.cancel();
                if (isSampleReading) {
                  window.speechSynthesis.pause();
                } else {
                  const textToRead =
                    "This is a sample text for testing the speech synthesis feature.";
                  const utterance = new SpeechSynthesisUtterance(textToRead);
                  const voices = window.speechSynthesis.getVoices();
                  utterance.voice =
                    voices.find((voice) => voice.name === user.settings.voice) || voices[0];

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
                      <span style={{ fontWeight: 500 }}>{getLanguageRegion(voice.lang || "")}</span>
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
              📝 A simple todo app project made using React.js and MUI with many features, including
              sharing tasks via link, theme customization and offline usage as a PWA.
            </Typography>
            <img
              src="https://raw.githubusercontent.com/maciekt07/TodoApp/main/screenshots/baner.png"
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
        </Box>
      </DialogContent>
    </Dialog>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}
const TabHeading = styled(Typography)`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const SectionHeading = styled(Typography)`
  font-size: 16px;
  font-weight: 500;
  margin-top: 16px;
  margin-bottom: 4px;
`;

const SectionDescription = styled(Typography)`
  font-size: 14px;
  line-height: 1.5;
  opacity: 0.7;
  margin-bottom: 8px;
`;

const UnstyledTab = (props: TabProps) => {
  const isMobile = useResponsiveDisplay();
  return <Tab iconPosition={isMobile ? "top" : "start"} {...props} />;
};

const StyledTab = styled(UnstyledTab)`
  justify-content: flex-start;
  margin-right: 12px;
  border-radius: 14px;
  min-height: 0;
  padding: 18px;
  &.Mui-selected {
    background-color: ${({ theme }) => theme.primary + "23"};
  }
  @media (max-width: 768px) {
    margin-right: 0;
    font-size: 13px;
    min-height: 0;
    padding: 10px 6px;
    margin: 0;
    border-radius: 0;
  }
`;

const UnstyledSelect = (props: SelectProps) => {
  const isMobile = useResponsiveDisplay();
  return (
    <Select
      fullWidth
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: isMobile ? 400 : 220,
            overflowY: "auto", // Make the dropdown scrollable if the content exceeds the height
          },
        },
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "left",
        },
      }}
      {...props}
    />
  );
};

const StyledSelect = styled(UnstyledSelect)`
  margin: 8px 0;
`;

const StyledMenuItem = styled(MenuItem)`
  padding: 12px 20px;
  border-radius: 12px;
  margin: 0 8px;
  display: flex;
  gap: 6px;
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
  background: #afafaf2b;
  padding: 12px 24px 12px 18px;
  border-radius: 18px;
  transition: 0.3s all;
  width: 100%;
`;
