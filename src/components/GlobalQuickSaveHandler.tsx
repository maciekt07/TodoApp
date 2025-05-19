import { useState, ReactNode, useContext, useEffect } from "react";
import { Dialog, DialogContent, DialogActions, Typography } from "@mui/material";
import { CustomDialogTitle } from ".";
import { DialogBtn } from "../styles";
import { SaveAltRounded } from "@mui/icons-material";
import { UserContext } from "../contexts/UserContext";
import { exportTasksToJson } from "../utils";

export const GlobalQuickSaveHandler = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(UserContext);
  const { tasks } = user;

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.key === "s" || e.key === "S") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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
