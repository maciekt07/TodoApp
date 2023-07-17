import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Switch,
} from "@mui/material";
import { UserProps } from "../types/user";
import { DialogBtn } from "../styles";
import styled from "@emotion/styled";

interface SettingsProps extends UserProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({
  open,
  onClose,
  user,
  setUser,
}: SettingsProps) => {
  const [settings, setSettings] = useState(user.settings[0]);

  const handleSettingChange =
    (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedSettings = {
        ...settings,
        [name]: event.target.checked,
      };
      setSettings(updatedSettings);
      setUser((prevUser) => ({
        ...prevUser,
        settings: [updatedSettings],
      }));
    };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: "24px",
          padding: "12px",
        },
      }}
    >
      <DialogTitle>Settings</DialogTitle>
      <Container>
        <FormGroup>
          <FormLabel>App Settings</FormLabel>
          <FormControlLabel
            sx={{ opacity: settings.enableCategories ? 1 : 0.8 }}
            control={
              <Switch
                checked={settings.enableCategories}
                onChange={handleSettingChange("enableCategories")}
              />
            }
            label={
              <>
                Enable Categories &nbsp;
                <Beta>BETA</Beta>
              </>
            }
          />
        </FormGroup>
        <FormGroup>
          <FormControlLabel
            sx={{ opacity: settings.enableGlow ? 1 : 0.8 }}
            control={
              <Switch
                checked={settings.enableGlow}
                onChange={handleSettingChange("enableGlow")}
              />
            }
            label="Enable Glow Effect"
          />
        </FormGroup>
        <FormGroup>
          <FormControlLabel
            sx={{ opacity: settings.doneToBottom ? 1 : 0.8 }}
            control={
              <Switch
                checked={settings.doneToBottom}
                onChange={handleSettingChange("doneToBottom")}
              />
            }
            label="Move Done Tasks To Bottom"
          />
        </FormGroup>
      </Container>
      <DialogActions>
        <DialogBtn onClick={onClose}>Close</DialogBtn>
      </DialogActions>
    </Dialog>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: left;
  align-items: left;
  flex-direction: column;
  user-select: none;
  margin: 0 18px;
  gap: 6px;
`;

const Beta = styled.span`
  background: #0e8e0e;
  color: #00ff00;
  font-size: 12px;
  letter-spacing: 0.03em;
  padding: 2px 6px;
  border-radius: 5px;
  font-weight: 600;
  box-shadow: 0 0 4px 0 #0e8e0e91;
`;
