import { useContext, useEffect } from "react";
import { exportTasksToJson } from "../utils";
import { UserContext } from "../contexts/UserContext";

/**
 * Custom React hook that enables saving tasks to JSON when the user presses Ctrl + S.
 * @returns {void}
 */
export const useCtrlS = (): void => {
  const { user } = useContext(UserContext);
  const { tasks } = user;
  // Check if the key combination is Ctrl + S
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.key === "s" || e.key === "S") && (e.ctrlKey || e.metaKey)) {
      // Prevent the default browser save dialog
      e.preventDefault();
      const userConfirmed = window.confirm("Do you want to save all tasks to JSON?");
      if (userConfirmed) {
        exportTasksToJson(tasks);
      }
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
};
