import { useTranslation } from "react-i18next";
import { systemInfo } from "../../../utils";
import ShortcutItem from "../ShortcutItem";

export default function ShortcutsTab() {
  const { t } = useTranslation();
  const cmdOrCtrl = systemInfo.isAppleDevice ? "Cmd" : "Ctrl";

  return (
    <>
      <ShortcutItem
        name={t("shortcuts.quickExport.name", { defaultValue: "Quick Export" })}
        description={t("shortcuts.quickExport.description", {
          defaultValue: "Save all tasks and download as JSON file",
        })}
        keys={[cmdOrCtrl, "S"]}
      />
      <ShortcutItem
        name={t("shortcuts.quickSearch.name", { defaultValue: "Quick Search" })}
        description={t("shortcuts.quickSearch.description", { defaultValue: "Focus search input" })}
        keys={[cmdOrCtrl, "/"]}
      />
      <ShortcutItem
        name={t("shortcuts.printTasks.name", { defaultValue: "Print Tasks" })}
        description={t("shortcuts.printTasks.description", {
          defaultValue: "Print the current task list",
        })}
        keys={[cmdOrCtrl, "P"]}
      />
      <ShortcutItem
        name={t("shortcuts.toggleTheme.name", { defaultValue: "Toggle Theme" })}
        description={t("shortcuts.toggleTheme.description", {
          defaultValue: "Switch between light and dark mode",
        })}
        keys={[cmdOrCtrl, "Shift", "L"]}
      />
      {/* <ShortcutItem
        name={t("shortcuts.toggleSidebar.name", { defaultValue: "Toggle Sidebar" })}
        description={t("shortcuts.toggleSidebar.description", { defaultValue: "Open or close the sidebar" })}
        keys={[cmdOrCtrl, "B"]}
      /> */}
    </>
  );
}
