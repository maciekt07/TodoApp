import { LanguageRounded } from "@mui/icons-material";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../contexts/UserContext";
import { languages } from "../../i18n/config";
import { SettingLabel, SettingsContainer } from "./settings.styled";

export const LanguageSelect = () => {
  const { user, setUser } = useContext(UserContext);
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;

    // Update user settings
    setUser((prevUser) => ({
      ...prevUser,
      settings: {
        ...prevUser.settings,
        language: newLanguage,
      },
    }));

    // Change language in i18n
    i18n.changeLanguage(newLanguage);
  };

  return (
    <SettingsContainer>
      <SettingLabel>
        <LanguageRounded /> {t("settings.language")}
      </SettingLabel>
      <Select
        value={user.settings.language}
        onChange={handleLanguageChange}
        sx={{
          width: "200px",
          borderRadius: "14px",
        }}
      >
        {Object.entries(languages).map(([code, { nativeName }]) => (
          <MenuItem key={code} value={code}>
            {nativeName}
          </MenuItem>
        ))}
      </Select>
    </SettingsContainer>
  );
};
