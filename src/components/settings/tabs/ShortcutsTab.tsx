import { TabHeading } from "../settings.styled";
import ShortcutItem from "../ShortcutItem";
// TODO: add shortcut more shortcuts and custom hook
export default function ShortcutsTab() {
  return (
    <>
      <TabHeading>Keyboard Shortcuts</TabHeading>
      <ShortcutItem
        name="Quick Export"
        description="Save all tasks and download as JSON file"
        keys={["Ctrl", "S"]}
      />
      <ShortcutItem name="Quick Search" description="Focus search input" keys={["Ctrl", "/"]} />
      <ShortcutItem
        name="Print Tasks"
        description="Print the current task list"
        keys={["Ctrl", "P"]}
      />
    </>
  );
}
