import { systemInfo } from "../../../utils";
import CustomSwitch from "../CustomSwitch";
import { TabHeading } from "../settings.styled";

export default function GeneralTab() {
  return (
    <>
      <TabHeading>General Settings</TabHeading>
      <CustomSwitch
        settingKey="enableCategories"
        header="Enable Categories"
        text="Enable categories to organize your tasks."
      />
      <CustomSwitch
        settingKey="appBadge"
        header="App Badge"
        text="Show a badge on the PWA icon to indicate the number of not done tasks."
        disabled={!systemInfo.isPWA || !("setAppBadge" in navigator)}
        disabledReason="This feature requires the app to be installed as a PWA and supported by your browser."
      />
      <CustomSwitch
        settingKey="doneToBottom"
        header="Completed Tasks at Bottom"
        text="Move completed tasks to the bottom of the list to keep your active tasks more visible."
      />
      <CustomSwitch
        settingKey="showProgressBar"
        header="Show Progress Bar"
        text="Display a progress bar at the top of the screen to visualize your task completion."
      />
    </>
  );
}
