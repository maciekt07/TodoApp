import { useState, ReactNode, useContext, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogActions, Typography } from "@mui/material";
import { CustomDialogTitle } from ".";
import { DialogBtn } from "../styles";
import { SaveAltRounded } from "@mui/icons-material";
import { UserContext } from "../contexts/UserContext";
import { exportTasksToJson } from "../utils";

import { isDarkMode } from "../theme/createTheme";
import { useTheme } from "@emotion/react";
import { useSystemTheme } from "../hooks/useSystemTheme";

export const GlobalQuickSaveHandler = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { tasks } = user;
  const theme = useTheme();
  const systemTheme = useSystemTheme();

  const darkmodeRef = useRef(user.darkmode);
  useEffect(() => {
    darkmodeRef.current = user.darkmode;
  }, [user.darkmode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      // Ctrl/Cmd + S for quick save dialog
      if (e.key.toLowerCase() === "s" && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        return;
      }

      // Ctrl/Cmd + Shift + L to toggle dark mode
      if (e.key.toLowerCase() === "l" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();

        let newMode: "dark" | "light";

        if (darkmodeRef.current === "dark") {
          newMode = "light";
        } else if (darkmodeRef.current === "light") {
          newMode = "dark";
        } else {
          const currentIsDark = isDarkMode(darkmodeRef.current, systemTheme, theme.secondary);
          newMode = currentIsDark ? "light" : "dark";
        }

        setUser((prev) => ({
          ...prev,
          darkmode: newMode,
        }));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setUser, systemTheme, theme.secondary, isOpen]);

  const handleClose = (confirmed: boolean) => {
    setIsOpen(false);
    if (confirmed) {
      exportTasksToJson(tasks);
    }
  };

  return (
    <>
      {children}
      <Dialog open={isOpen} onClose={() => handleClose(false)} fullWidth>
        <CustomDialogTitle
          title="Quick Save"
          subTitle="Save your current tasks instantly"
          icon={<SaveAltRounded />}
          onClose={() => handleClose(false)}
        />
        <DialogContent sx={{ pt: 1, pb: 2 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              mb: 1,
              fontSize: "1rem",
            }}
          >
            Export all current tasks as a JSON file?
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: "0.85rem",
              lineHeight: 1.5,
            }}
          >
            Your tasks will be saved locally on your device, making it easy to restore your workflow
            later or transfer to another device.
          </Typography>
        </DialogContent>

        <DialogActions>
          <DialogBtn onClick={() => handleClose(false)}>Cancel</DialogBtn>
          <DialogBtn onClick={() => handleClose(true)}>
            <SaveAltRounded fontSize="small" /> &nbsp; Save
          </DialogBtn>
        </DialogActions>
      </Dialog>
    </>
  );
};
