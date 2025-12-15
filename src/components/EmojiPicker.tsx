import { useTheme as useEmotionTheme } from "@emotion/react";
import styled from "@emotion/styled";
import {
  AddReaction,
  AutoAwesome,
  Edit,
  EmojiEmotions,
  RemoveCircleOutline,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Tooltip,
} from "@mui/material";
import EmojiPicker, {
  Emoji,
  EmojiClickData,
  EmojiStyle,
  SuggestionMode,
  Theme,
} from "emoji-picker-react";
import {
  CSSProperties,
  Dispatch,
  SetStateAction,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { CATEGORY_NAME_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
import { UserContext } from "../contexts/UserContext";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { DialogBtn, fadeIn, reduceMotion } from "../styles";
import { ColorPalette } from "../theme/themeConfig";
import { getFontColor, showToast, systemInfo } from "../utils";
import { CustomDialogTitle } from "./DialogTitle";
import DisabledThemeProvider from "../contexts/DisabledThemeProvider";

interface EmojiPickerProps {
  emoji?: string;
  setEmoji: Dispatch<SetStateAction<string | null>>; // TODO: use onEmojiChange instead
  color?: string;
  name?: string;
  type?: "task" | "category";
}

export const CustomEmojiPicker = ({ emoji, setEmoji, color, name, type }: EmojiPickerProps) => {
  const { t } = useTranslation();
  const { user, setUser } = useContext(UserContext);
  const { emojisStyle, settings } = user;
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string | null>(emoji || null);

  const isOnline = useOnlineStatus();
  const emotionTheme = useEmotionTheme();

  interface EmojiItem {
    unified: string;
    original: string;
    count: number;
  }

  const getFrequentlyUsedEmojis = (): string[] => {
    const frequentlyUsedEmojis: EmojiItem[] | null = JSON.parse(
      localStorage.getItem("epr_suggested") || "null",
    );

    if (!frequentlyUsedEmojis) {
      return [];
    }

    frequentlyUsedEmojis.sort((a, b) => b.count - a.count);
    return frequentlyUsedEmojis.slice(0, 6).map((item) => item.unified);
  };

  // When the currentEmoji state changes, update the parent component's emoji state
  useEffect(() => {
    setEmoji(currentEmoji);
  }, [currentEmoji, setEmoji]);

  // When the emoji prop changes to an empty string, set the currentEmoji state to undefined
  useEffect(() => {
    if (emoji === "") {
      setCurrentEmoji(null);
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
  };

  const handleRemoveEmoji = () => {
    toggleEmojiPicker();
    setCurrentEmoji(null);
  };

  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [session, setSession] = useState<LanguageModel | null>(null);

  // Create Session on component mount for faster first load
  useEffect(() => {
    const createSession = async () => {
      if ("LanguageModel" in window) {
        const session = await LanguageModel.create();
        setSession(session);
      }
    };
    createSession();
  }, []);

  // ‼ This feature works only in Chrome (Dev / Canary) version 127 or higher with some flags enabled and Gemini Nano model installed
  // https://developer.chrome.com/docs/ai/built-in
  async function useAI(): Promise<void> {
    const start = new Date().getTime();
    setIsAILoading(true);
    try {
      const sessionInstance: LanguageModel = session || (await LanguageModel.create());

      // chrome://flags/#text-safety-classifier must be disabled to make this prompt work
      const response = await sessionInstance.prompt(
        `Respond with ONLY ONE emoji that best represents this task: "${name}". DO NOT include any other text, explanations, or symbols. Just the SINGLE emoji.`,
      );

      console.log("Full AI response:", response);

      // this doesn't split emojis into separate characters
      // 替换为兼容性更好的 emoji 匹配正则
      // 参考：https://thekevinscott.com/emojis-in-javascript/
      const emojiRegex =
        /([\u231A-\u231B]|[\u23E9-\u23EC]|[\u23F0]|[\u23F3]|[\u25FD-\u25FE]|[\u2614-\u2615]|[\u2648-\u2653]|[\u267F]|[\u2693]|[\u26A1]|[\u26AA-\u26AB]|[\u26BD-\u26BE]|[\u26C4-\u26C5]|[\u26CE]|[\u26D4]|[\u26EA]|[\u26F2-\u26F3]|[\u26F5]|[\u26FA]|[\u26FD]|[\u2705]|[\u270A-\u270B]|[\u2728]|[\u274C]|[\u274E]|[\u2753-\u2755]|[\u2757]|[\u2795-\u2797]|[\u27B0]|[\u27BF]|[\u2B1B-\u2B1C]|[\u2B50]|[\u2B55]|[\u1F004]|[\u1F0CF]|[\u1F18E]|[\u1F191-\u1F19A]|[\u1F1E6-\u1F1FF]|[\u1F201-\u1F202]|[\u1F21A]|[\u1F22F]|[\u1F232-\u1F23A]|[\u1F250-\u1F251]|[\u1F300-\u1F320]|[\u1F32D-\u1F335]|[\u1F337-\u1F37C]|[\u1F37E-\u1F393]|[\u1F3A0-\u1F3CA]|[\u1F3CF-\u1F3D3]|[\u1F3E0-\u1F3F0]|[\u1F3F4]|[\u1F3F8-\u1F43E]|[\u1F440]|[\u1F442-\u1F4FC]|[\u1F4FF-\u1F53D]|[\u1F54B-\u1F54E]|[\u1F550-\u1F567]|[\u1F57A]|[\u1F595-\u1F596]|[\u1F5A4]|[\u1F5FB-\u1F64F]|[\u1F680-\u1F6C5]|[\u1F6CC]|[\u1F6D0]|[\u1F6D1-\u1F6D2]|[\u1F6EB-\u1F6EC]|[\u1F6F4-\u1F6F8]|[\u1F910-\u1F93A]|[\u1F93C-\u1F93E]|[\u1F940-\u1F945]|[\u1F947-\u1F94C]|[\u1F950-\u1F96B]|[\u1F980-\u1F997]|[\u1F9C0]|[\u1F9D0-\u1F9E6]|[\u1FA70-\u1FA73]|[\u1FA78-\u1FA7A]|[\u1FA80-\u1FA82]|[\u1FA90-\u1FA95])/g;

      const extractedEmojis = response.trim().replace(/\*/g, "").match(emojiRegex) || [];

      // Remove duplicates
      const uniqueEmojis = [...new Set(extractedEmojis)];
      console.log("Unique Emojis:", uniqueEmojis);

      if (uniqueEmojis.length === 0) {
        setCurrentEmoji(null);
        showToast(
          <div>
            <b>{t("emojiPicker.noEmojiFoundTitle", { defaultValue: "No emoji found." })}</b> <br />
            {t("emojiPicker.noEmojiFound", {
              defaultValue: "Please try again with different {{type}} name.",
              type,
            })}
          </div>,
          {
            type: "error",
          },
        );
        console.error("No emoji found.");
        return;
      }

      let emojiResponse = uniqueEmojis[0];

      // Check if the emoji needs to be replaced
      const emojiMap: {
        [key: string]: string;
      } = {
        "☮": "✌️",
        "🎙": "🎙️",
        "🗣": "🗣️",
        "✈": "✈️",
        "🍽": "🍽️",
        "⌨": "⌨️",
        "🖱": "🖱️",
      };

      if (emojiResponse in emojiMap) {
        emojiResponse = emojiMap[emojiResponse];
        console.log("Emoji replaced with:", emojiResponse);
      }

      const unified = emojiToUnified(emojiResponse.replaceAll(":", ""));
      console.log("Emoji unified:", unified);

      if (emojiRegex.test(emojiResponse)) {
        setIsAILoading(false);
        setCurrentEmoji(unified);
      } else {
        setCurrentEmoji(null);
        showToast(
          <div>
            <b>{t("emojiPicker.invalidEmojiTitle", { defaultValue: "Invalid emoji." })}</b> <br />
            {t("emojiPicker.invalidEmoji", {
              defaultValue: "Please try again with different {{type}} name.",
              type,
            })}
          </div>,
          {
            type: "error",
          },
        );
        console.error("Invalid emoji.", unified);
      }
    } catch (error) {
      setIsAILoading(false);
      setCurrentEmoji(null);
      console.error(error);
      showToast(
        <div>
          <b>
            {t("emojiPicker.failedToGenerateTitle", { defaultValue: "Failed to generate emoji." })}
          </b>
          <br />
          {t("emojiPicker.failedToGenerate", { defaultValue: "{{error}}", error: String(error) })}
        </div>,
        { type: "error", duration: 8000 },
      );
    } finally {
      setIsAILoading(false);
      const end = new Date().getTime();
      console.log(
        `%cTook ${end - start}ms to generate.`,
        `color: ${end - start > 1500 ? "orange" : "lime"}`,
      );
    }
  }

  const emojiToUnified = (emoji: string): string => {
    return Array.from(emoji)
      .map((char) => char.codePointAt(0)?.toString(16).toUpperCase() || "")
      .join("-")
      .toLowerCase();
  };

  // end of AI experimental feature code

  // Function to render the content of the Avatar based on whether an emoji is selected or not
  const renderAvatarContent = () => {
    const fontColor = color ? getFontColor(color) : ColorPalette.fontLight;
    if (isAILoading) {
      return <CircularProgress size={40} thickness={5} sx={{ color: fontColor }} />;
    }
    if (currentEmoji) {
      const emojiSize =
        emojisStyle === EmojiStyle.NATIVE && systemInfo.os === "iOS"
          ? 64
          : emojisStyle === EmojiStyle.NATIVE
            ? 48
            : 64;

      return (
        <EmojiElement key={currentEmoji}>
          <Emoji size={emojiSize} emojiStyle={emojisStyle} unified={currentEmoji} />
        </EmojiElement>
      );
    } else {
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

  useEffect(() => {
    setShowEmojiPicker(false);
  }, [user.settings.simpleEmojiPicker]);

  return (
    <>
      <EmojiContainer>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <EditBadge
              onClick={toggleEmojiPicker}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleEmojiPicker();
                }
              }}
            >
              <Edit />
            </EditBadge>
          }
        >
          <EmojiAvatar clr={color} onClick={toggleEmojiPicker}>
            {renderAvatarContent()}
          </EmojiAvatar>
        </Badge>
      </EmojiContainer>
      {"LanguageModel" in window && name !== undefined && (
        <Tooltip
          title={
            !name
              ? t("emojiPicker.enterNameForAI", {
                  defaultValue: `Enter a name for the ${type} to find emoji`,
                  type,
                })
              : undefined
          }
        >
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <DisabledThemeProvider>
              <Button
                onClick={useAI}
                disabled={
                  name?.length < 3 ||
                  (type === "task"
                    ? name.length > TASK_NAME_MAX_LENGTH
                    : name.length > CATEGORY_NAME_MAX_LENGTH)
                }
              >
                <AutoAwesome /> &nbsp;{" "}
                {t("emojiPicker.findWithAI", { defaultValue: "Find emoji with AI" })}
              </Button>
            </DisabledThemeProvider>
          </div>
        </Tooltip>
      )}
      {/* Simple Emoji Picker */}
      {showEmojiPicker && settings.simpleEmojiPicker && (
        <SimplePickerContainer>
          <Suspense fallback={<CircularProgress size={40} thickness={5} />}>
            <EmojiPicker
              style={{ border: "none" }}
              reactionsDefaultOpen
              reactions={getFrequentlyUsedEmojis()}
              emojiStyle={emojisStyle}
              onReactionClick={handleEmojiClick}
              allowExpandReactions={false}
              theme={emotionTheme.darkmode ? Theme.DARK : Theme.LIGHT}
              autoFocusSearch={false}
            />
          </Suspense>
          {currentEmoji && (
            <Button onClick={handleRemoveEmoji} fullWidth variant="outlined" color="error">
              <RemoveCircleOutline /> &nbsp;{" "}
              {t("emojiPicker.remove", { defaultValue: "Remove Emoji" })}
            </Button>
          )}
        </SimplePickerContainer>
      )}

      {showEmojiPicker && !settings.simpleEmojiPicker && (
        <>
          <Dialog
            open={showEmojiPicker}
            onClose={toggleEmojiPicker}
            slotProps={{
              paper: {
                style: {
                  padding: "12px",
                  borderRadius: "24px",
                  minWidth: "400px",
                },
              },
            }}
          >
            <CustomDialogTitle
              title={t("emojiPicker.title", { defaultValue: "Choose Emoji" })}
              subTitle={t("emojiPicker.subtitle", {
                defaultValue: `Choose the perfect emoji for your ${type}.`,
                type,
              })}
              onClose={toggleEmojiPicker}
              icon={<AddReaction />}
            />
            <DialogContent sx={{ p: 0, m: 0 }}>
              {!isOnline && emojisStyle !== EmojiStyle.NATIVE && (
                <Box sx={{ mx: "14px", mb: "16px" }}>
                  <Alert severity="warning">
                    {t("emojiPicker.offlineWarning", {
                      defaultValue:
                        "Emojis may not load correctly when offline. Try switching to the native emoji style.",
                    })}
                  </Alert>
                  <Button
                    variant="outlined"
                    color="warning"
                    fullWidth
                    sx={{ mt: "14px" }}
                    onClick={() => {
                      setUser((prevUser) => ({
                        ...prevUser,
                        emojisStyle: EmojiStyle.NATIVE,
                      }));
                      setShowEmojiPicker(false);
                      setTimeout(() => setShowEmojiPicker(true), 100);
                    }}
                  >
                    <EmojiEmotions /> &nbsp;{" "}
                    {t("emojiPicker.switchToNative", { defaultValue: "Switch to Native Emoji" })}
                  </Button>
                </Box>
              )}
              <EmojiPickerContainer>
                <Suspense
                  fallback={
                    !settings.simpleEmojiPicker && (
                      <PickerLoader
                        pickerTheme={emotionTheme.darkmode ? "dark" : "light"}
                      ></PickerLoader>
                    )
                  }
                >
                  <EmojiPicker
                    width="100vw"
                    height="550px"
                    lazyLoadEmojis
                    emojiStyle={emojisStyle}
                    theme={emotionTheme.darkmode ? Theme.DARK : Theme.LIGHT}
                    suggestedEmojisMode={SuggestionMode.FREQUENT}
                    autoFocusSearch={false}
                    onEmojiClick={handleEmojiClick}
                    searchPlaceHolder={t("emojiPicker.searchPlaceholder", {
                      defaultValue: "Search emoji",
                    })}
                    previewConfig={{
                      defaultEmoji: "1f4dd",
                      defaultCaption: t("emojiPicker.previewCaption", {
                        defaultValue: `Choose the perfect emoji for your ${type}`,
                        type,
                      }),
                    }}
                  />
                </Suspense>
              </EmojiPickerContainer>
            </DialogContent>
            <DialogActions>
              {currentEmoji && (
                <DialogBtn color="error" onClick={handleRemoveEmoji}>
                  <RemoveCircleOutline /> &nbsp;{" "}
                  {t("emojiPicker.remove", { defaultValue: "Remove Emoji" })}
                </DialogBtn>
              )}
              {/* <DialogBtn onClick={() => n("#settings/Emoji")}>*/}
              <DialogBtn onClick={toggleEmojiPicker}>
                {t("common.cancel", { defaultValue: "Cancel" })}
              </DialogBtn>
            </DialogActions>
          </Dialog>
        </>
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

const EmojiPickerContainer = styled(DialogContent)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px 16px;
  animation: ${fadeIn} 0.4s ease-in;
  padding: 0;
  ${({ theme }) => reduceMotion(theme)}
`;

const SimplePickerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  margin: 16px;
  animation: ${fadeIn} 0.4s ease-in;
  padding: 0;
  ${({ theme }) => reduceMotion(theme)}
`;

const EmojiAvatar = styled(Avatar)<{ clr: string | undefined }>`
  background: ${({ clr, theme }) => clr || theme.primary};
  transition: 0.3s all;
  cursor: pointer;
  width: 96px;
  height: 96px;
`;

const EditBadge = styled(Avatar)`
  background: #9c9c9c81;
  backdrop-filter: blur(6px);
  cursor: pointer;
`;

interface PickerLoaderProps {
  pickerTheme: "light" | "dark" | undefined;
  width?: CSSProperties["width"] | undefined;
}

const PickerLoader = styled.div<PickerLoaderProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ width }) => width || "350px"};
  height: 500px;
  padding: 8px;
  border-radius: 20px;
  background: transparent;
  border: ${({ pickerTheme }) => `1px solid ${pickerTheme === "dark" ? "#151617" : "#e7e7e7"}`};
`;

const EmojiElement = styled.div`
  animation: ${fadeIn} 0.4s ease-in;
  ${({ theme }) => reduceMotion(theme)}
`;
