import { systemInfo } from "../../../utils";
import { TabHeading } from "../settings.styled";
import ShortcutItem from "../ShortcutItem";

export default function ShortcutsTab() {
  const cmdOrCtrl = systemInfo.isAppleDevice ? "Cmd" : "Ctrl";

  return (
    <>
      <TabHeading>Keyboard Shortcuts</TabHeading>
      <ShortcutItem
        name="Quick Export"
        description="Save all tasks and download as JSON file"
        keys={[cmdOrCtrl, "S"]}
      />
      <ShortcutItem name="Quick Search" description="Focus search input" keys={[cmdOrCtrl, "/"]} />
      <ShortcutItem
        name="Print Tasks"
        description="Print the current task list"
        keys={[cmdOrCtrl, "P"]}
      />
      <ShortcutItem
        name="Toggle Theme"
        description="Switch between light and dark mode"
        keys={[cmdOrCtrl, "Shift", "L"]}
      />
      {/* <ShortcutItem
        name="Toggle Sidebar"
        description="Open or close the sidebar"
        keys={[cmdOrCtrl, "B"]}
      /> */}
    </>
  );
}
