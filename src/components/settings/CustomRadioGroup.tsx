import styled from "@emotion/styled";
import { Box, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { getFontColor } from "../../utils";
import type { OptionItem } from "./settingsTypes";
import { useEffect, useState } from "react";
import { SyncAltRounded } from "@mui/icons-material";
import { css } from "@emotion/react";

interface CustomRadioGroupProps<T> {
  options: OptionItem<T>[];
  value: T;
  disabledOptions?: T[];
  onChange: (value: T) => void;
}

const CustomRadioGroup = <T extends string>({
  options,
  value,
  disabledOptions = [],
  onChange,
}: CustomRadioGroupProps<T>) => {
  const [focusedValue, setFocusedValue] = useState<T | null>(null);
  const [keyboardFocus, setKeyboardFocus] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key.startsWith("Arrow")) {
        setKeyboardFocus(true);
      }
    };

    const handleMouseDown = () => {
      setKeyboardFocus(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <>
      <StyledRadioGroup value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((option) => {
          const isDisabled = disabledOptions.includes(option.value);
          const isSelected = value === option.value;
          const isFocused = focusedValue === option.value;
          return (
            <FormControlLabel
              key={option.value}
              value={option.value}
              disabled={isDisabled}
              sx={{ position: "relative", margin: 0, padding: 0 }}
              control={
                <StyledRadioControl
                  onFocus={() => setFocusedValue(option.value)}
                  onBlur={() => setFocusedValue(null)}
                />
              }
              label={
                <StyledLabelBox
                  selected={isSelected}
                  disabled={isDisabled}
                  focused={isFocused && keyboardFocus}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <IconWrapper>{option.icon}</IconWrapper>
                  <StyledLabel translate="no" variant="body2">
                    {option.label}
                  </StyledLabel>
                </StyledLabelBox>
              }
            />
          );
        })}
      </StyledRadioGroup>
      {focusedValue && keyboardFocus && (
        <FocusHint>
          <SyncAltRounded /> Navigate with arrow keys
        </FocusHint>
      )}
    </>
  );
};

export default CustomRadioGroup;

// TODO: make options full width

const StyledRadioGroup = styled(RadioGroup)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 16px;
  margin: 0 6px;
  flex-wrap: wrap;
  margin-top: 12px;
  width: 100%;
  max-width: calc(100% - 16px);
  box-sizing: border-box;
  @media (max-width: 768px) {
    gap: 12px;
    margin: 12px 0 0 0;
    max-width: calc(100% - 8px);
  }
`;

// make radio control invisible but accessible with keyboard navigation
const StyledRadioControl = styled(Radio)`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  z-index: 1;
`;

interface StyledLabelBoxProps {
  selected: boolean;
  disabled?: boolean;
  focused?: boolean;
}

const StyledLabelBox = styled(Box)<StyledLabelBoxProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border-radius: 12px;
  width: 100px;
  height: 100px;
  color: ${({ theme, selected }) => selected && getFontColor(theme.primary)};
  background-color: ${({ theme, selected }) => (selected ? theme.primary : "transparent")};
  transition: background-color 0.3s ease-in-out;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  box-sizing: border-box;
  user-select: none;

  ${({ disabled, theme, selected }) =>
    !disabled &&
    css`
      &:hover {
        background-color: ${selected ? theme.primary : "rgba(0, 0, 0, 0.08)"};
      }
    `}

  ${({ focused, theme }) =>
    focused &&
    css`
      outline: 3px solid ${theme.primary};
      outline-offset: 3px;
      box-shadow: 0 0 8px ${theme.primary}AA;
    `}

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const IconWrapper = styled.div`
  font-size: 28px;
  width: 1em;
  height: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  margin-bottom: 12px;
`;

const StyledLabel = styled(Typography)`
  font-weight: 500;
  text-align: center;
  max-width: 100px;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FocusHint = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  gap: 4px;
  opacity: 0.8;
  font-size: 14px;
`;
