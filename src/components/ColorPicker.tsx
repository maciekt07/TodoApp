import { CSSProperties, useEffect, useState } from "react";
import { ColorPalette } from "../styles";
import styled from "@emotion/styled";
import { Casino, Colorize, Done } from "@mui/icons-material";
import { getFontColorFromHex } from "../utils";
import { Grid, Tooltip } from "@mui/material";

interface CustomColorPickerProps {
  color: string;
  setColor: (newColor: string) => void;
  width?: CSSProperties["width"];
}

/**
 * Custom Color Picker component for selecting colors.
 */
export const ColorPicker = ({ color, setColor, width }: CustomColorPickerProps) => {
  const [selectedColor, setSelectedColor] = useState<string>(color);

  const colors: string[] = [
    ColorPalette.purple,
    "#ff6b6b",
    "#ffb733",
    "#6bff91",
    "#33b7ff",
    "#ff33cc",
    "#ffd633",
    "#c6a7ff",
    "#ffc3a0",
    "#FF69B4",
  ];

  useEffect(() => {
    setColor(selectedColor);
  }, [selectedColor]);

  useEffect(() => {
    setSelectedColor(color);
  }, [color]);

  const handleRandomColor = () => {
    let randomColor = Math.floor(Math.random() * 16777215).toString(16);
    randomColor = "#" + ("000000" + randomColor).slice(-6);
    setSelectedColor(randomColor);
  };

  return (
    <>
      <Grid container spacing={1} maxWidth={width || 400} m={1}>
        {colors.map((color) => (
          <Grid item key={color}>
            <ColorElement
              clr={color}
              onClick={() => {
                setSelectedColor(color);
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
                <StyledColorPicker
                  width={width || "52px"}
                  type="color"
                  value={selectedColor}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSelectedColor(e.target.value as string);
                  }}
                />
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
    </>
  );
};

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
  border-radius: 18px;
  transition: 0.2s all;
  transform: scale(1);
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

const StyledColorPicker = styled.input<{ width: CSSProperties["width"] }>`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  /* width: ${({ width }) => width}; */
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
