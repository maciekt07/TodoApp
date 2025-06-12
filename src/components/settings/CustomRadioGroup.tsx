import styled from "@emotion/styled";
import { Box, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { getFontColor } from "../../utils";
import type { OptionItem } from "./settingsTypes";

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
  return (
    <StyledRadioGroup value={value} onChange={(e) => onChange(e.target.value as T)}>
      {options.map((option) => {
        const isDisabled = disabledOptions.includes(option.value);
        return (
          <FormControlLabel
            key={option.value}
            value={option.value}
            disabled={isDisabled}
            control={<Radio sx={{ display: "none" }} />}
            label={
              <StyledLabelBox
                selected={value === option.value}
                disabled={isDisabled}
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <Typography
                  fontSize="28px"
                  sx={{ opacity: isDisabled && value !== option.value ? 0.6 : 1 }}
                >
                  {option.icon}
                </Typography>
                <StyledLabel translate="no" variant="body2">
                  {option.label}
                </StyledLabel>
              </StyledLabelBox>
            }
          />
        );
      })}
    </StyledRadioGroup>
  );
};

export default CustomRadioGroup;

// TODO: make options full width

const StyledRadioGroup = styled(RadioGroup)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 12px;
  flex-wrap: wrap;
  margin: 0px 6px;
  padding: 8px;
  width: 100%;
  max-width: calc(100% - 24px);
  box-sizing: border-box;
  @media (max-width: 768px) {
    gap: 4px;
  }
`;

const StyledLabelBox = styled(Box)<{ selected: boolean; disabled?: boolean }>`
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
  & .epr-emoji-native {
    width: unset !important;
    height: unset !important;
  }

  ${({ disabled, theme, selected }) =>
    !disabled &&
    `
    &:hover {
      background-color: ${selected ? theme.primary : "rgba(0, 0, 0, 0.08)"};
    }
  `}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const StyledLabel = styled(Typography)`
  font-weight: 500;
  text-align: center;
  max-width: 100px;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
`;
