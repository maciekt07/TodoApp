import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import {
  AddRounded,
  ColorizeRounded,
  DoneRounded,
  ExpandMoreRounded,
  InfoRounded,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Popover,
  Tooltip,
} from "@mui/material";
import { getColorName } from "ntc-ts";
import { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from "react";
import { type ToastOptions } from "react-hot-toast";
import { MAX_COLORS_IN_LIST } from "../constants";
import { UserContext } from "../contexts/UserContext";
import { ColorElement, DialogBtn, scale } from "../styles";
import { ColorPalette } from "../theme/themeConfig";
import { getFontColor, showToast } from "../utils";

interface ColorPickerProps {
  color: string;
  onColorChange: (newColor: string) => void;
  width?: CSSProperties["width"];
  fontColor?: CSSProperties["color"];
  label?: string;
}

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
  const { user, setUser } = useContext(UserContext);
  const { colorList } = user;
  const [selectedColor, setSelectedColor] = useState<string>(color);
  const [accordionExpanded, setAccordionExpanded] = useState<boolean>(false);

  const [popoverOpen, setPopoverOpen] = useState<boolean[]>(Array(colorList.length).fill(false));
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [addColorVal, setAddColorVal] = useState<string>(color);
  const colorElementRefs = useRef<Array<HTMLElement | null>>([]);

  const theme = useTheme();

  const isHexColor = (value: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(value);

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

  const togglePopover = (index: number) => {
    const newPopoverOpen = [...popoverOpen];
    newPopoverOpen[index] = !newPopoverOpen[index];
    setPopoverOpen(newPopoverOpen);
  };

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
    setAddColorVal(selectedColor);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setAddColorVal(selectedColor);
  };

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddColorVal(e.target.value as string);

  const ToastColorOptions = (color: string): Pick<ToastOptions, "iconTheme" | "style"> => {
    return {
      iconTheme: { primary: color, secondary: getFontColor(color) },
      style: { borderColor: color },
    };
  };

  const handleAddColor = () => {
    if (colorList.length >= MAX_COLORS_IN_LIST) {
      showToast(`You cannot add more than ${MAX_COLORS_IN_LIST} colors to color list.`, {
        type: "error",
      });
      return;
    }

    if (
      colorList.some((color) => color.toLowerCase() === addColorVal.toLowerCase()) ||
      addColorVal.toLowerCase() === theme.primary.toLowerCase()
    ) {
      showToast("Color is already in color list.", { type: "error" });
      return;
    }

    handleColorChange(addColorVal.toUpperCase());
    setUser({ ...user, colorList: [...colorList, addColorVal.toUpperCase()] });
    showToast(
      <div>
        Added{" "}
        <b>
          <ToastColorPreview clr={addColorVal} />
          {getColorName(addColorVal).name}
        </b>{" "}
        to your color list.
      </div>,
      ToastColorOptions(addColorVal)
    );
    handleAddDialogClose();
  };

  const handleDeleteColor = (clr: string) => {
    setPopoverOpen(Array(colorList.length).fill(false));
    showToast(
      <div>
        Removed{" "}
        <b>
          <ToastColorPreview clr={clr} />
          {getColorName(clr).name}
        </b>{" "}
        from your color list.
      </div>,
      ToastColorOptions(clr)
    );

    setUser({
      ...user,
      colorList: colorList.filter((listColor) => listColor !== clr),
    });
  };

  return (
    <>
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
            <span style={{ color: fontColor || ColorPalette.fontLight }}>
              {label || "Color"}
              {!accordionExpanded && ` - ${getColorName(selectedColor).name}`}
            </span>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <ColorPreview maxWidth={width || 400} clr={selectedColor}>
            {selectedColor.toUpperCase()} - {getColorName(selectedColor).name}
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
              {[theme.primary, ...colorList].map((color, index) => (
                <Grid item key={color}>
                  <Tooltip title={getColorName(color).name}>
                    <ColorElement
                      ref={(element) => (colorElementRefs.current[index] = element)}
                      id={`color-element-${index}`}
                      clr={color}
                      aria-label={`Select color - ${color}`}
                      // show delete popover only on desktop
                      onContextMenu={(e) => {
                        if (
                          window.matchMedia("(pointer:fine)").matches &&
                          color !== theme.primary
                        ) {
                          e.preventDefault();
                          togglePopover(index);
                        }
                      }}
                      onClick={() => {
                        handleColorChange(color);
                        // show delete popover on mobile only after double tap
                        if (!window.matchMedia("(pointer:fine)").matches) {
                          if (selectedColor === color && color !== theme.primary) {
                            togglePopover(index);
                          }
                        }
                      }}
                    >
                      {color.toUpperCase() === selectedColor.toUpperCase() && <SelectedIcon />}
                    </ColorElement>
                  </Tooltip>
                  <Popover
                    open={popoverOpen[index] === true}
                    onClose={() => togglePopover(index)}
                    anchorEl={colorElementRefs.current[index]}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    slotProps={{
                      paper: {
                        sx: {
                          background: "transparent",
                          boxShadow: "none",
                        },
                      },
                    }}
                  >
                    <div>
                      <DeleteColorBtn onClick={() => handleDeleteColor(color)}>
                        Delete
                      </DeleteColorBtn>
                    </div>
                  </Popover>
                </Grid>
              ))}
              <Tooltip title="Add new color">
                <Grid item>
                  <ColorElement
                    clr="transparent"
                    style={{ border: "2px solid", color: fontColor || ColorPalette.fontLight }}
                    onClick={handleAddDialogOpen}
                  >
                    <AddRounded style={{ fontSize: "38px" }} />
                  </ColorElement>
                </Grid>
              </Tooltip>
            </Grid>
          </div>
          <StyledInfo clr={fontColor || ColorPalette.fontLight}>
            <InfoRounded fontSize="small" />{" "}
            {window.matchMedia("(pointer:fine)").matches ? "Right click" : "Double tap"} to remove
            color from list
          </StyledInfo>
        </AccordionDetails>
      </StyledAccordion>
      <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
        <DialogTitle>Add new color</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "4px 0",
              fontWeight: 600,
            }}
          >
            {addColorVal.toUpperCase()} - {getColorName(addColorVal).name}
          </div>
          <div style={{ position: "relative" }}>
            <StyledColorPicker
              type="color"
              // list={systemInfo.os === "iOS" ? "color-list" : undefined}
              value={addColorVal}
              onChange={handlePickerChange}
            />
            {/* <datalist id="color-list">
              <option value={theme.primary} />
              {colorList.map((color) => (
                <option value={color} key={color} />
              ))}
            </datalist> */}
            <PickerLabel clr={getFontColor(addColorVal)}>
              <ColorizeRounded /> Choose color
            </PickerLabel>
          </div>
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={handleAddDialogClose}>Cancel</DialogBtn>
          <DialogBtn
            onClick={() => {
              onColorChange(addColorVal);
              handleAddDialogClose();
            }}
          >
            <ColorizeRounded /> &nbsp; Set
          </DialogBtn>
          <DialogBtn onClick={handleAddColor}>
            <AddRounded /> &nbsp; Add
          </DialogBtn>
        </DialogActions>
      </Dialog>
    </>
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

const ToastColorPreview = styled(AccordionPreview)`
  width: 18px;
  height: 18px;
  border-radius: 6px;
  display: inline-block;
  margin-right: 5px;
  margin-left: 2px;
  vertical-align: middle;
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

const DeleteColorBtn = styled.button`
  border: none;
  outline: none;
  background-color: #141431dd;
  color: #ff4e4e;
  font-weight: 500;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 10px;
  backdrop-filter: blur(6px);
  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 15px;
  }
`;

const StyledInfo = styled.span<{ clr: string }>`
  color: ${({ clr }) => clr};
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  margin-left: 4px;
  font-size: 14px;
`;

const PickerLabel = styled.p<{ clr: string }>`
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ clr }) => clr};
  pointer-events: none;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0%);
  font-weight: 600;
`;

const SelectedIcon = styled(DoneRounded)`
  font-size: 28px;
  animation: ${scale} 0.25s;
`;

const StyledColorPicker = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 54px;
  width: 100%;
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
