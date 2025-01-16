import React, { useContext } from "react";
import { Box, Switch, Typography, FormControlLabel, FormGroup } from "@mui/material";
import { User } from "../../types/user";
import { UserContext } from "../../contexts/UserContext";

interface CustomSwitchProps {
  header: string;
  text?: string;
  settingKey: Exclude<keyof Omit<User["settings"], "voice" | "voiceVolume">, undefined>;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ header, text, settingKey }) => {
  const { user, setUser } = useContext(UserContext);

  const handleToggle = () => {
    const updatedSettings = {
      ...user.settings,
      [settingKey]: !user.settings[settingKey],
    };
    setUser((prev) => ({ ...prev, settings: updatedSettings }));
  };

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", fontSize: "16px" }}>
          {header}
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={user.settings[settingKey]} onChange={handleToggle} />}
            label=""
          />
        </FormGroup>
      </Box>
      {text && (
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0 }}>
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default CustomSwitch;
