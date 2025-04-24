import { FormControl, FormLabel, Select, SelectChangeEvent, styled, MenuItem } from "@mui/material";
import { CSSProperties } from "react";
import { TaskPriority } from "../types/user";
import { ColorPalette } from "../theme/themeConfig";

interface Props {
  width?: CSSProperties["width"];
  onPriorityChange: (priority: TaskPriority) => void;
  selectedPriority: TaskPriority;
  fontColor?: CSSProperties["color"];
}

export const PrioritySelect: React.FC<Props> = ({
  width,
  onPriorityChange,
  selectedPriority,
  fontColor,
}) => {
  const handlePriorityChange = (event: SelectChangeEvent<unknown>) => {
    onPriorityChange(event.target.value as TaskPriority);
  };

  const priorityOptions: TaskPriority[] = ["Low", "Medium", "High"];

  return (
    <FormControl sx={{ width: width || "100%" }}>
      <FormLabel
        sx={{
          color: fontColor ? `${fontColor}e8` : `${ColorPalette.fontLight}e8`,
          marginLeft: "8px",
          fontWeight: 500,
        }}
      >
        Priority
      </FormLabel>

      <StyledSelect width={width} value={selectedPriority} onChange={handlePriorityChange}>
        {priorityOptions.map((priority) => (
          <MenuItem key={priority} value={priority}>
            {priority}
          </MenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  );
};

const StyledSelect = styled(Select)<{ width?: CSSProperties["width"] }>`
  margin: 12px 0;
  border-radius: 16px !important;
  transition: 0.3s all;
  width: ${({ width }) => width || "100%"};

  /* background: #ffffff18; */
  z-index: 999;
  border: none !important;
`;
