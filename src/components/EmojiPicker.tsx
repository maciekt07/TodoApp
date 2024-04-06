import { useState, useEffect, Dispatch, SetStateAction, CSSProperties, useContext } from "react";
import styled from "@emotion/styled";
import { Avatar, Badge, Button } from "@mui/material";
import { AddReaction, Edit, RemoveCircleOutline } from "@mui/icons-material";
import EmojiPicker, {
  Emoji,
  EmojiClickData,
  EmojiStyle,
  SuggestionMode,
  Theme,
} from "emoji-picker-react";
import { getFontColor } from "../utils";
import { ColorPalette, fadeIn } from "../styles";
import { UserContext } from "../contexts/UserContext";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { iOS } from "../utils/iOS";

interface EmojiPickerProps {
  emoji?: string;
  //FIXME:
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setEmoji: Dispatch<SetStateAction<any>>;
  //TODO:
  // onEmojiChange: (emojiData: EmojiClickData) => void;
  color?: string;
  width?: CSSProperties["width"];
  theme?: "light" | "dark";
}

export const CustomEmojiPicker = ({ emoji, setEmoji, color, width, theme }: EmojiPickerProps) => {
  const { user, setUser } = useContext(UserContext);
  const { emojisStyle, settings } = user;
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string | null>(emoji || null);

  const isOnline = useOnlineStatus();

  //FIXME: emojis doesnt load on first load using Emoji component

  // const customEmojis: CustomEmoji[] = [
  //   {
  //     names: ["Todo App", "Todo App Logo"],
  //     imgUrl: logo,
  //     id: "todoapp",
  //   },
  //   { names: ["React.js", "React"], imgUrl: ReactLogo, id: "reactjs" },
  //   { names: ["Github", "Github Logo"], imgUrl: githubLogo, id: "github" },
  //   //User pfp
  //   { names: ["Crying Cat", "cat", "cry"], imgUrl: cryingCat, id: "cryingcat" },
  // ];

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
    // setEmojiData(e);
    console.log(e);
    // console.log(e.getImageUrl(user.emojisStyle));
  };

  const handleRemoveEmoji = () => {
    toggleEmojiPicker();
    setCurrentEmoji(null);
  };

  // Function to render the content of the Avatar based on whether an emoji is selected or not
  const renderAvatarContent = () => {
    if (currentEmoji) {
      // Determine the size of the emoji based on the user's emoji style preference
      // const emojiSize = user.emojisStyle === EmojiStyle.NATIVE ? 48 : 64;

      const emojiSize =
        emojisStyle === EmojiStyle.NATIVE && iOS ? 64 : emojisStyle === EmojiStyle.NATIVE ? 48 : 64;

      return (
        <EmojiElement key={currentEmoji}>
          <Emoji size={emojiSize} emojiStyle={emojisStyle} unified={currentEmoji} />
        </EmojiElement>
      );
    } else {
      // If no emoji is selected, show the AddReaction icon with the specified color or default purple
      const fontColor = color ? getFontColor(color) : ColorPalette.fontLight;
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
        {/* <Tooltip
          title={
            showEmojiPicker
              ? "Close Emoji Picker"
              : currentEmoji
              ? "Change Emoji"
              : "Choose an Emoji"
          }
        > */}
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
              background: color || ColorPalette.purple,
              transition: ".3s all",
              cursor: "pointer",
            }}
          >
            {renderAvatarContent()}
          </Avatar>
        </Badge>
        {/* </Tooltip> */}
      </EmojiContainer>
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
                  onClick={() => {
                    setUser((prevUser) => ({
                      ...prevUser,
                      emojisStyle: EmojiStyle.NATIVE,
                    }));
                  }}
                  sx={{ borderRadius: "12px", p: "10px 20px" }}
                >
                  Change Style
                </Button>
              </span>
            </div>
          )}
          <EmojiPickerContainer>
            <EmojiPicker
              width={width || "350px"}
              height="500px"
              reactionsDefaultOpen={
                settings[0].simpleEmojiPicker && getFrequentlyUsedEmojis().length !== 0
              }
              reactions={getFrequentlyUsedEmojis()}
              emojiStyle={emojisStyle}
              // customEmojis={customEmojis}
              theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
              suggestedEmojisMode={SuggestionMode.FREQUENT}
              autoFocusSearch={false}
              lazyLoadEmojis
              onEmojiClick={handleEmojiClick}
              searchPlaceHolder="Search emoji"
              previewConfig={{
                defaultEmoji: "1f4dd",
                defaultCaption: "Choose the perfect emoji for your task",
              }}
            />
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

const EmojiElement = styled.div`
  animation: ${fadeIn} 0.4s ease-in;
`;
