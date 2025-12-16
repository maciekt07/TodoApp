import { Emoji, EmojiStyle } from "emoji-picker-react";
import CustomRadioGroup from "../CustomRadioGroup";
import { SectionDescription, SectionHeading } from "../settings.styled";
import { useOnlineStatus } from "../../../hooks/useOnlineStatus";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { DeleteRounded, WifiOffRounded } from "@mui/icons-material";
import { Alert, AlertTitle, Button } from "@mui/material";
import CustomSwitch from "../CustomSwitch";
import { showToast } from "../../../utils";
import type { OptionItem } from "../settingsTypes";
import { OPTION_ICON_SIZE } from "../settingsConstants";
import { useTranslation } from "react-i18next";

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

const offlineDisabledEmojiStyles = emojiStyles
  .map((option) => option.value)
  .filter((value) => value !== EmojiStyle.NATIVE);

export default function EmojiTab() {
  const { t } = useTranslation();
  const { user, setUser } = useContext(UserContext);
  const [emojiStyleValue, setEmojiStyleValue] = useState<EmojiStyle>(user.emojisStyle);
  const [hasEmojiData, setHasEmojiData] = useState<boolean>(
    !!localStorage.getItem("epr_suggested"),
  );

  const isOnline = useOnlineStatus();
  // update local state when user settings change (e.g. after P2P sync)
  useEffect(() => {
    setEmojiStyleValue(user.emojisStyle);
  }, [user.darkmode, user.emojisStyle]);

  return (
    <>
      <SectionHeading>{t("settingsTabs.emoji.emojiStyle")}</SectionHeading>
      <CustomRadioGroup
        options={emojiStyles.map((option) => ({
          ...option,
          label: t(`settingsTabs.emoji.${option.value.toLowerCase()}`),
        }))}
        value={emojiStyleValue}
        onChange={(val) => {
          setEmojiStyleValue(val);
          setUser((prevUser) => ({
            ...prevUser,
            emojisStyle: val,
          }));
        }}
        disabledOptions={isOnline ? [] : offlineDisabledEmojiStyles}
      />

      {!isOnline && (
        <Alert severity="warning" sx={{ mt: "8px" }} icon={<WifiOffRounded />}>
          <AlertTitle>
            {t("settingsTabs.emoji.offlineTitle", { defaultValue: "Offline Mode" })}
          </AlertTitle>
          {t("settingsTabs.emoji.offlineWarning", {
            defaultValue: "You are currently offline. Non-native emoji styles may not load.",
          })}
        </Alert>
      )}
      <CustomSwitch
        settingKey="simpleEmojiPicker"
        header={t("settingsTabs.emoji.simpleEmojiPicker")}
        text={t("settingsTabs.emoji.simpleEmojiPickerDescription")}
        disabled={!hasEmojiData}
        disabledReason={t("settingsTabs.emoji.noRecentEmojis", {
          defaultValue: "No recent emojis available.",
        })}
      />
      <SectionHeading>{t("settingsTabs.emoji.emojiData")}</SectionHeading>
      <SectionDescription>
        {t("settingsTabs.emoji.emojiDataDescription", {
          defaultValue: "Clear data about recently used emojis",
        })}
      </SectionDescription>
      <Button
        variant="contained"
        color="error"
        onClick={() => {
          localStorage.removeItem("epr_suggested");
          showToast(
            t("settingsTabs.emoji.removedEmojiData", { defaultValue: "Removed emoji data." }),
          );
          setHasEmojiData(false);
          if (user.settings.simpleEmojiPicker) {
            setUser((prev) => ({
              ...prev,
              settings: { ...prev.settings, simpleEmojiPicker: false },
            }));
          }
        }}
      >
        <DeleteRounded /> &nbsp;{" "}
        {t("settingsTabs.emoji.clearEmojiData", { defaultValue: "Clear Emoji Data" })}
      </Button>
    </>
  );
}
