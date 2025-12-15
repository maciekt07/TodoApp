import { useTranslation } from "react-i18next";
import { systemInfo } from "../../../utils";
import CustomSwitch from "../CustomSwitch";
import { LanguageSelect } from "../LanguageSelect";

export default function GeneralTab() {
  const { t } = useTranslation();

  return (
    <>
      <LanguageSelect />
      <CustomSwitch
        settingKey="enableCategories"
        header={t("settingsTabs.general.enableCategories")}
        text={t("settingsTabs.general.enableCategoriesDescription")}
      />
      <CustomSwitch
        settingKey="appBadge"
        header={t("settingsTabs.general.appBadge")}
        text={t("settingsTabs.general.appBadgeDescription")}
        disabled={!systemInfo.isPWA || !("setAppBadge" in navigator)}
        disabledReason={t("settingsTabs.general.appBadgeDisabled")}
      />
      <CustomSwitch
        settingKey="doneToBottom"
        header={t("settingsTabs.general.doneToBottom")}
        text={t("settingsTabs.general.doneToBottomDescription")}
      />
      <CustomSwitch
        settingKey="showProgressBar"
        header={t("settingsTabs.general.showProgressBar")}
        text={t("settingsTabs.general.showProgressBarDescription")}
      />
    </>
  );
}
