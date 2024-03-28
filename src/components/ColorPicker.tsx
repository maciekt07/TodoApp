import { CSSProperties, useCallback, useEffect, useState } from "react";
import { ColorElement, ColorPalette } from "../styles";
import styled from "@emotion/styled";
import { Casino, Colorize, Done, ExpandMoreRounded } from "@mui/icons-material";
import { getFontColor } from "../utils";
import { Accordion, AccordionDetails, AccordionSummary, Grid, Tooltip } from "@mui/material";
import { useTheme } from "@emotion/react";

interface ColorPickerProps {
  color: string;
  onColorChange: (newColor: string) => void;
  width?: CSSProperties["width"];
  fontColor?: CSSProperties["color"];
  label?: string;
}

// TODO: redesign color picker component

/**
 * Custom Color Picker component for selecting colors.
 */

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onColorChange,
  width,
  fontColor,
  label,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(color);
  const [accordionExpanded, setAccordionExpanded] = useState<boolean>(false);

  const theme = useTheme();

  const isHexColor = (value: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(value);

  // Predefined color options
  const colors: string[] = [
    theme.primary,
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

  const handleColorChange = useCallback(
    (color: string) => {
      setSelectedColor(color);
      onColorChange(color);
    },
    [onColorChange]
  );

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
      handleColorChange(theme.primary);
      setSelectedColor(theme.primary);
      console.error("Invalid hex color " + color);
    }
  }, [color, handleColorChange, theme.primary]);

  const handleAccordionChange = (
    _event: React.SyntheticEvent<Element, Event>,
    isExpanded: boolean
  ) => setAccordionExpanded(isExpanded);

  return (
    <div>
      <StyledAccordion
        onChange={handleAccordionChange}
        sx={{
          width: width,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreRounded sx={{ color: fontColor || ColorPalette.fontLight }} />}
          sx={{ fontWeight: 500 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {!accordionExpanded && <AccordionPreview clr={selectedColor} />}
            <span style={{ color: fontColor || ColorPalette.fontLight }}>{label || "Color"}</span>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <ColorPreview maxWidth={width || 400} clr={selectedColor}>
            {selectedColor.toUpperCase()}
          </ColorPreview>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: width || 400,
            }}
          >
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
                      <StyledColorPicker
                        type="color"
                        value={selectedColor}
                        onChange={handlePickerChange}
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
          </div>
        </AccordionDetails>
      </StyledAccordion>
    </div>
  );
};

const StyledAccordion = styled(Accordion)`
  background: #ffffff18;
  border-radius: 16px !important;
  border: 1px solid #0000003a;
  box-shadow: none;
  padding: 6px 0;
  margin: 8px 0;
`;

const AccordionPreview = styled.div<{ clr: string }>`
  width: 24px;
  height: 24px;
  background: ${({ clr }) => clr};
  border-radius: 8px;
  transition: 0.3s background;
`;

const ColorPreview = styled(Grid)<{ clr: string }>`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ clr }) => clr};
  color: ${({ clr }) => getFontColor(clr)};
  padding: 8px;
  border-radius: 100px;
  transition: 0.3s all;
  font-weight: 600;
  border: 2px solid #ffffffab;
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
  color: ${({ clr }) => getFontColor(clr)};
  position: absolute;
  cursor: pointer;
  pointer-events: none;
`;
