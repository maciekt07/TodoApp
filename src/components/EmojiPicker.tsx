import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { AddReaction, AutoAwesome, Edit, RemoveCircleOutline } from "@mui/icons-material";
import { Avatar, Badge, Button, CircularProgress } from "@mui/material";
import { Emoji, EmojiClickData, EmojiStyle, SuggestionMode, Theme } from "emoji-picker-react";
import {
  CSSProperties,
  Dispatch,
  SetStateAction,
  Suspense,
  lazy,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserContext } from "../contexts/UserContext";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { fadeIn } from "../styles";
import { ColorPalette } from "../theme/themeConfig";
import { getFontColor, showToast, systemInfo } from "../utils";

const EmojiPicker = lazy(() => import("emoji-picker-react"));
interface EmojiPickerProps {
  emoji?: string;
  //FIXME:
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setEmoji: Dispatch<SetStateAction<any>>;
  //TODO:
  // onEmojiChange: (emojiData: EmojiClickData) => void;
  color?: string;
  width?: CSSProperties["width"];
  name?: string;
}

export const CustomEmojiPicker = ({ emoji, setEmoji, color, width, name }: EmojiPickerProps) => {
  const { user, setUser } = useContext(UserContext);
  const { emojisStyle, settings } = user;
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string | null>(emoji || null);

  const isOnline = useOnlineStatus();
  const emotionTheme = useTheme();

  interface EmojiItem {
    unified: string;
    original: string;
    count: number;
  }

  const getFrequentlyUsedEmojis = (): string[] => {
    const frequentlyUsedEmojis: EmojiItem[] | null = JSON.parse(
      localStorage.getItem("epr_suggested") || "null"
    );

    if (!frequentlyUsedEmojis) {
      return [];
    }

    frequentlyUsedEmojis.sort((a: EmojiItem, b: EmojiItem) => b.count - a.count);
    const topEmojis: EmojiItem[] = frequentlyUsedEmojis.slice(0, 6);
    const topUnified: string[] = topEmojis.map((item: EmojiItem) => item.unified);

    return topUnified;
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
    console.log(e);
  };

  const handleRemoveEmoji = () => {
    toggleEmojiPicker();
    setCurrentEmoji(null);
  };

  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  // ‼ This feature works only in Chrome (Dev / Canary) version 127 or higher with some flags enabled
  async function useAI() {
    const start = new Date().getTime();
    setIsAILoading(true);
    //@ts-expect-error window.ai is an experimental chrome feature
    const session = window.ai.createTextSession();

    const sessionInstance = await session;

    const response = await sessionInstance.prompt(
      `Choose an emoji that best represents the task: ${name}. (For example: 🖥️ for coding, 📝 for writing, 🎨 for design) Type 'none' if not applicable.`
    );

    console.log("Full AI response:", response);
    // Validate if userInput is a valid emoji
    const emojiRegex =
      /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    if (emojiRegex.test(response)) {
      setIsAILoading(false);

      const unified = emojiToUnified(response.trim().toLowerCase()).toLowerCase();
      console.log("Emoji unified:", unified);
      setCurrentEmoji(unified);
    } else {
      setCurrentEmoji(null);
      showToast(
        `Invalid emoji (response: ${response}). Please try again with different task name.`,
        { type: "error" }
      );
      console.error("Invalid emoji.");
    }
    const end = new Date().getTime();
    setIsAILoading(false);
    console.log(`%cTook ${end - start}ms to generate.`, "color: lime");
  }

  const emojiToUnified = (emoji: string): string => {
    const codePoints = [...emoji].map((char) => {
      if (char) {
        return char.codePointAt(0)?.toString(16).toUpperCase() ?? "";
      }
      return "";
    });
    return codePoints.join("-");
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

  return (
    <>
      <EmojiContainer>
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
              background: color || emotionTheme.primary,
              transition: ".3s all",
              cursor: "pointer",
            }}
          >
            {renderAvatarContent()}
          </Avatar>
        </Badge>
      </EmojiContainer>
      {"ai" in window && name && (
        <Button
          onClick={useAI}
          disabled={name?.length < 5}
          style={{ width: "250px", height: "50px", marginBottom: "4px" }}
        >
          <AutoAwesome /> &nbsp; Find emoji with AI
        </Button>
      )}
      {showEmojiPicker && (
        <>
          {!isOnline && emojisStyle !== EmojiStyle.NATIVE && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                maxWidth: width || "350px",
                margin: "6px auto -6px auto",
              }}
            >
              <span style={{ margin: 0, fontSize: "14px", textAlign: "center" }}>
                Emojis may not load correctly when offline. Try switching to the native emoji style.
                <br />
                <Button
                  variant="outlined"
                  onClick={() => {
                    setUser((prevUser) => ({
                      ...prevUser,
                      emojisStyle: EmojiStyle.NATIVE,
                    }));
                  }}
                  sx={{ borderRadius: "12px", p: "10px 20px", mt: "12px" }}
                >
                  Change Style
                </Button>
              </span>
            </div>
          )}

          <EmojiPickerContainer>
            <Suspense
              fallback={
                !settings[0].simpleEmojiPicker && (
                  <PickerLoader
                    pickerTheme={emotionTheme.darkmode ? "dark" : "light"}
                    width={width}
                  ></PickerLoader>
                )
              }
            >
              <EmojiPicker
                width={width || "350px"}
                height="500px"
                reactionsDefaultOpen={
                  settings[0].simpleEmojiPicker && getFrequentlyUsedEmojis().length !== 0
                }
                reactions={getFrequentlyUsedEmojis()}
                emojiStyle={emojisStyle}
                theme={emotionTheme.darkmode ? Theme.DARK : Theme.LIGHT}
                suggestedEmojisMode={SuggestionMode.FREQUENT}
                autoFocusSearch={false}
                onEmojiClick={handleEmojiClick}
                searchPlaceHolder="Search emoji"
                previewConfig={{
                  defaultEmoji: "1f4dd",
                  defaultCaption: "Choose the perfect emoji for your task",
                }}
              />
            </Suspense>
          </EmojiPickerContainer>
          {currentEmoji && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={handleRemoveEmoji}
                sx={{ p: "10px 20px", borderRadius: "12px" }}
              >
                <RemoveCircleOutline /> &nbsp; Remove Emoji
              </Button>
            </div>
          )}
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

const EmojiPickerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px;
  animation: ${fadeIn} 0.4s ease-in;
`;

const PickerLoader = styled.div<{
  pickerTheme: "light" | "dark" | undefined;
  width: CSSProperties["width"] | undefined;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ width }) => width || "350px"};
  height: 500px;
  padding: 8px;
  border-radius: 20px;
  background: ${({ pickerTheme }) => (pickerTheme === "dark" ? "#222222" : "#ffffff")};
  border: ${({ pickerTheme }) => `1px solid ${pickerTheme === "dark" ? "#151617" : "#e7e7e7"}`};
`;

const EmojiElement = styled.div`
  animation: ${fadeIn} 0.4s ease-in;
`;
