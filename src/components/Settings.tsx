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
import { ChangeEvent, useState } from "react";

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
  const [categories, setCategories] = useState(
    user.settings[0].enableCategories
  );

  const [glow, setGlow] = useState(user.settings[0].enableGlow);

  const [doneToBottom, setDoneToBottom] = useState(
    user.settings[0].doneToBottom
  );

  const handleCategoriesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedSettings = [
      {
        ...user.settings[0],
        enableCategories: event.target.checked,
      },
    ];
    setUser((prevUser) => ({
      ...prevUser,
      settings: updatedSettings,
    }));
    setCategories(event.target.checked);
  };

  const handleGlowChange = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedSettings = [
      {
        ...user.settings[0],
        enableGlow: event.target.checked,
      },
    ];
    setUser((prevUser) => ({
      ...prevUser,
      settings: updatedSettings,
    }));
    setGlow(event.target.checked);
  };

  const handleDoneToBottomChange = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedSettings = [
      {
        ...user.settings[0],
        doneToBottom: event.target.checked,
      },
    ];
    setUser((prevUser) => ({
      ...prevUser,
      settings: updatedSettings,
    }));
    setDoneToBottom(event.target.checked);
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
      <DialogTitle>Settings {user.name}</DialogTitle>
      <Container>
        <FormGroup>
          <FormLabel>App Settings</FormLabel>
          <FormControlLabel
            sx={{ opacity: categories ? 1 : 0.8 }}
            control={
              <Switch checked={categories} onChange={handleCategoriesChange} />
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
            sx={{ opacity: glow ? 1 : 0.8 }}
            control={<Switch checked={glow} onChange={handleGlowChange} />}
            label="Enable Glow Effect"
          />
        </FormGroup>
        <FormGroup>
          <FormControlLabel
            sx={{ opacity: doneToBottom ? 1 : 0.8 }}
            control={
              <Switch
                checked={doneToBottom}
                onChange={handleDoneToBottomChange}
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
