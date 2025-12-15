import { ExpandMoreRounded, LanguageRounded } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../contexts/UserContext";
import { languages } from "../../i18n/config";
import { SectionHeading, StyledMenuItem, StyledSelect } from "./settings.styled";

export const LanguageSelect = () => {
  const { user, setUser } = useContext(UserContext);
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent<unknown>) => {
    const newLanguage = event.target.value as string;

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
    <>
      <SectionHeading>
        <LanguageRounded sx={{ fontSize: "18px", verticalAlign: "middle" }} />{" "}
        {t("settings.language")}
      </SectionHeading>
      <StyledSelect
        value={user.settings.language}
        onChange={handleLanguageChange}
        IconComponent={ExpandMoreRounded}
      >
        {Object.entries(languages).map(([code, { nativeName }]) => (
          <StyledMenuItem key={code} value={code}>
            {nativeName}
          </StyledMenuItem>
        ))}
      </StyledSelect>
    </>
  );
};
