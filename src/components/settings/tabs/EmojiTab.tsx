import { Emoji, EmojiStyle } from "emoji-picker-react";
import CustomRadioGroup from "../CustomRadioGroup";
import { SectionDescription, SectionHeading, TabHeading } from "../settings.styled";
import { useOnlineStatus } from "../../../hooks/useOnlineStatus";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { DeleteRounded, WifiOffRounded } from "@mui/icons-material";
import { Alert, AlertTitle, Button } from "@mui/material";
import CustomSwitch from "../CustomSwitch";
import { showToast } from "../../../utils";
import type { OptionItem } from "../settingsTypes";
import { OPTION_ICON_SIZE } from "../settingsConstants";

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

export default function EmojiTab() {
  const { user, setUser } = useContext(UserContext);
  const [emojiStyleValue, setEmojiStyleValue] = useState<EmojiStyle>(user.emojisStyle);

  const isOnline = useOnlineStatus();
  // update local state when user settings change (e.g. after P2P sync)
  useEffect(() => {
    setEmojiStyleValue(user.emojisStyle);
  }, [user.darkmode, user.emojisStyle]);

  return (
    <>
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
        disabledOptions={
          !isOnline
            ? [EmojiStyle.APPLE, EmojiStyle.FACEBOOK, EmojiStyle.TWITTER, EmojiStyle.GOOGLE]
            : []
        }
      />

      {!isOnline && (
        <Alert severity="warning" sx={{ mt: "8px" }} icon={<WifiOffRounded />}>
          <AlertTitle>Offline Mode</AlertTitle>
          You are currently offline. Non-native emoji styles may not load.
        </Alert>
      )}
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
    </>
  );
}
