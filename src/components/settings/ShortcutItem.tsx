import { Box, Typography } from "@mui/material";
import { FC } from "react";
import styled from "@emotion/styled";

interface ShortcutItemProps {
  name: string;
  description?: string;
  keys: string[];
}

const ShortcutItem: FC<ShortcutItemProps> = ({ name, description, keys }) => {
  return (
    <ShortcutRow>
      <ShortcutText>
        <Typography fontWeight={600}>{name}</Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </ShortcutText>
      <KeyCombo>
        {keys.map((key, idx) => (
          <Key key={idx}>{key === "Cmd" ? "⌘" : key}</Key>
        ))}
      </KeyCombo>
    </ShortcutRow>
  );
};

export default ShortcutItem;

const ShortcutRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  gap: 8px;
  border-bottom: 1px solid
    ${({ theme }) => (theme.darkmode ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)")};
`;

const ShortcutText = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const KeyCombo = styled(Box)`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  flex-wrap: wrap;
`;

const Key = styled("kbd")`
  background: ${({ theme }) => (theme.darkmode ? "#2c2c2e" : "#f2f2f2")};
  border: 1px solid ${({ theme }) => (theme.darkmode ? "#4c4c4e" : "#d0d0d0")};
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 0.85rem;
  font-family: "Roboto Mono", monospace !important;
  color: ${({ theme }) => (theme.darkmode ? "#fff" : "#111")};
  box-shadow: ${({ theme }) =>
    theme.darkmode
      ? "inset 0 -1px 0 rgba(255, 255, 255, 0.1)"
      : "inset 0 -1px 0 rgba(0, 0, 0, 0.05)"};
  transition: all 0.2s ease;
`;
