import styled from "@emotion/styled";
import {
  CachedRounded,
  CloudOffRounded,
  CloudQueueRounded,
  ExpandMoreRounded,
  Google,
  Microsoft,
  RecordVoiceOverRounded,
  StopCircleRounded,
  VolumeDown,
  VolumeOff,
  VolumeUp,
  WifiOffRounded,
} from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Button,
  Chip,
  IconButton,
  MenuItem,
  SelectChangeEvent,
  Slider,
  Tooltip,
  useTheme as useMuiTheme,
} from "@mui/material";
import { Emoji } from "emoji-picker-react";
import { useContext, useEffect, useState } from "react";
import { defaultUser } from "../../../constants/defaultUser";
import { UserContext } from "../../../contexts/UserContext";
import { useOnlineStatus } from "../../../hooks/useOnlineStatus";
import type { AppSettings } from "../../../types/user";
import { getFontColor, systemInfo } from "../../../utils";
import CustomSwitch from "../CustomSwitch";
import {
  NoVoiceStyles,
  SectionHeading,
  StyledListSubheader,
  StyledSelect,
  TabHeading,
  VolumeSlider,
} from "../settings.styled";

export default function ReadAloudTab() {
  const { user, setUser } = useContext(UserContext);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceVolume, setVoiceVolume] = useState<number>(user.settings.voiceVolume);

  const [prevVoiceVol, setPrevVoiceVol] = useState<number>(user.settings.voiceVolume);
  const [isSampleReading, setIsSampleReading] = useState<boolean>(false);

  const muiTheme = useMuiTheme();
  const isOnline = useOnlineStatus();

  const readAloudEnabled = user.settings.enableReadAloud && "speechSynthesis" in window;

  // Cancel speech synthesis when the voice settings are changed
  useEffect(() => {
    if (!readAloudEnabled) {
      return;
    }
    setIsSampleReading(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [readAloudEnabled]);

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
    if (!readAloudEnabled) {
      return;
    }

    const loadVoices = () => {
      const voices = getAvailableVoices();
      setAvailableVoices(voices ?? []);
    };

    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [readAloudEnabled]);

  // Ensure the voices are loaded before calling getAvailableVoices
  if (readAloudEnabled) {
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
    <>
      <TabHeading>Read Aloud Settings</TabHeading>
      {!("speechSynthesis" in window) && (
        <Alert severity="error">
          <AlertTitle>Speech Synthesis Not Supported</AlertTitle>
          Your browser does not support built in text-to-speech.
        </Alert>
      )}
      <CustomSwitch
        settingKey="enableReadAloud"
        header="Enable Read Aloud"
        text="Loads voices and shows Read Aloud in the task menu."
        disabled={!("speechSynthesis" in window)}
      />
      <ReadAloudWrapper active={readAloudEnabled} disabled={!readAloudEnabled}>
        <SectionHeading>Play Sample</SectionHeading>
        <Button
          variant="contained"
          disabled={!("speechSynthesis" in window)}
          sx={{ color: getFontColor(muiTheme.palette.primary.main), mt: "8px" }}
          onClick={() => {
            if (!readAloudEnabled) return;
            window.speechSynthesis.cancel();
            if (isSampleReading) {
              window.speechSynthesis.pause();
            } else {
              const textToRead = "This is a sample text for testing the speech synthesis feature.";
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
          {isSampleReading ? <StopCircleRounded /> : <RecordVoiceOverRounded />} &nbsp; Play Sample
        </Button>
        <SectionHeading>Voice Selection</SectionHeading>
        {filteredVoices.length !== 0 ? (
          <StyledSelect
            value={user.settings.voice}
            variant="outlined"
            disabled={!readAloudEnabled}
            onChange={handleVoiceChange}
            translate="no"
            IconComponent={ExpandMoreRounded}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 500,
                },
              },
            }}
            sx={{
              // fix: stop hidden input from triggering caret/keyboard on this select
              "& .MuiSelect-nativeInput": {
                pointerEvents: "none",
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
                  sx={{
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: voice.localService === false && !isOnline ? "not-allowed" : "pointer",
                  }}
                >
                  {voice.name.startsWith("Google") && <Google sx={{ mr: "8px" }} />}
                  {voice.name.startsWith("Microsoft") && <Microsoft sx={{ mr: "8px" }} />}
                  {voice.name.replace(/^(Google|Microsoft)\s*|\([^()]*\)/gi, "")}
                  <Chip
                    sx={{ fontWeight: 500, padding: "4px", ml: "8px" }}
                    label={getLanguageRegion(voice.lang || "")}
                    icon={
                      <span style={{ fontSize: "16px", alignItems: "center", display: "flex" }}>
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
                    <span style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
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
            {user.settings.enableReadAloud && "speechSynthesis" in window && (
              <Tooltip title="Refetch voices">
                <IconButton
                  size="large"
                  onClick={() => setAvailableVoices(getAvailableVoices() ?? [])}
                >
                  <CachedRounded fontSize="large" />
                </IconButton>
              </Tooltip>
            )}
          </NoVoiceStyles>
        )}
        {!isOnline && availableVoices.some((voice) => voice.localService === false) && (
          <Alert severity="warning" sx={{ mt: "8px" }} icon={<WifiOffRounded />}>
            <AlertTitle>Offline Mode</AlertTitle>
            You are currently offline. Some Voices may require an internet connection to work.
          </Alert>
        )}
        <SectionHeading>Voice Volume</SectionHeading>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <VolumeSlider spacing={2} direction="row" alignItems="center">
            {/* <Tooltip title={voiceVolume ? "Mute" : "Unmute"}> */}
            <IconButton onClick={handleMuteClick}>
              {voiceVolume === 0 ? (
                <VolumeOff />
              ) : voiceVolume <= 0.4 ? (
                <VolumeDown />
              ) : (
                <VolumeUp />
              )}
            </IconButton>
            {/* </Tooltip> */}
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
      </ReadAloudWrapper>
    </>
  );
}

const ReadAloudWrapper = styled.fieldset<{ active: boolean }>`
  opacity: ${({ active }) => (active ? 1 : 0.6)};
  pointer-events: ${({ active }) => (active ? "auto" : "none")};
  border: none;
  margin: 0;
  padding: 0;

  button,
  input,
  select,
  textarea,
  a {
    pointer-events: ${({ active }) => (active ? "auto" : "none")};
    ${({ active }) => (!active ? "tab-index: -1;" : "")}
  }
`;
