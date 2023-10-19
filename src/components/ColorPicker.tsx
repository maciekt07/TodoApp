import { CSSProperties, useEffect, useState } from "react";
import { ColorPalette } from "../styles";
import styled from "@emotion/styled";
import { Casino, Colorize, Done } from "@mui/icons-material";
import { getFontColorFromHex } from "../utils";
import { Grid, Tooltip } from "@mui/material";

interface ColorPickerProps {
  color: string;
  onColorChange: (newColor: string) => void;
  width?: CSSProperties["width"];
}

/**
 * Custom Color Picker component for selecting colors.
 */
export const ColorPicker = ({ color, onColorChange, width }: ColorPickerProps) => {
  const [selectedColor, setSelectedColor] = useState<string>(color);
  const isHexColor = (value: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(value);

  // Predefined color options
  const colors: string[] = [
    ColorPalette.purple,
    "#FF69B4",
    "#FB34FF",
    "#FF22B4",
    "#c6a7ff",
    "#7ACCFA",
    "#4A9DFF",
    "#5061FF",
    "#50B5CB",
    "#3DFF7F",
    "#3AE836",
    "#B7FF42",
    "#FFEA28",
    "#F9BE26",
    "#FF9518",
    "#ffc3a0",
    "#FF5018",
    "#FF2F2F",
  ];

  useEffect(() => {
    // Update the selected color when the color prop changes
    setSelectedColor(color);
  }, [color]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleColorChange(e.target.value as string);

  // Handle selecting a random color
  const handleRandomColor = () => {
    let randomColor = Math.floor(Math.random() * 16777215).toString(16);
    randomColor = "#" + ("000000" + randomColor).slice(-6);
    handleColorChange(randomColor);
  };

  // Check if the current color is a valid hex color and update it if not
  useEffect(() => {
    if (!isHexColor(color)) {
      console.log(`Invalid hex color: ${color}`);
      handleColorChange(ColorPalette.purple);
    }
  }, [color]);

  return (
    <Grid container spacing={1} maxWidth={width || 400} m={1}>
      {colors.map((color) => (
        <Grid item key={color}>
          <ColorElement
            clr={color}
            aria-label={`Select color - ${color}`}
            onClick={() => {
              handleColorChange(color);
            }}
          >
            {color === selectedColor && <Done />}
          </ColorElement>
        </Grid>
      ))}
      <Tooltip title="Set custom color">
        <Grid item>
          <ColorPickerContainer>
            <ColorElement clr={selectedColor}>
              <StyledColorPicker type="color" value={selectedColor} onChange={handlePickerChange} />
              <ColorizeIcon clr={selectedColor} />
            </ColorElement>
          </ColorPickerContainer>
        </Grid>
      </Tooltip>
      <Tooltip title="Random color">
        <Grid item>
          <ColorElement clr="#1a81ff" onClick={handleRandomColor}>
            <Casino />
          </ColorElement>
        </Grid>
      </Tooltip>
    </Grid>
  );
};
// Styled button for color selection
const ColorElement = styled.button<{ clr: string }>`
  background-color: ${({ clr }) => clr};
  color: ${({ clr }) => getFontColorFromHex(clr)};
  border: none;
  cursor: pointer;
  width: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 999px;
  transition: 0.2s all;
  transform: scale(1);

  &:focus-visible {
    outline: 4px solid ${ColorPalette.purple};
  }
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 12px ${({ clr }) => clr};
    /* outline: none; */
  }
`;

const ColorPickerContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledColorPicker = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 54px;
  width: 54px;
  display: flex;

  background-color: transparent;
  border: none;
  cursor: pointer;

  &::-webkit-color-swatch {
    border-radius: 18px;
    border: none;
  }
  &::-moz-color-swatch {
    border-radius: 18px;
    border: none;
  }
`;

const ColorizeIcon = styled(Colorize)<{ clr: string }>`
  color: ${({ clr }) => getFontColorFromHex(clr)};
  position: absolute;
  cursor: pointer;
  pointer-events: none;
`;
