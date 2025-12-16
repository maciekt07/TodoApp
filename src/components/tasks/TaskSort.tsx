import React, { useContext } from "react";
import {
  AccessTimeRounded,
  CalendarTodayRounded,
  MoveUpRounded,
  SortByAlphaRounded,
} from "@mui/icons-material";
import { Button, css, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import { TaskContext } from "../../contexts/TaskContext";
import styled from "@emotion/styled";
import { SortOption } from "../../types/user";
import { getFontColor, isDark } from "../../utils";
import { useTranslation } from "react-i18next";

const sortOptions: {
  value: SortOption;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "dateCreated",
    label: "sort.dateCreated", // i18n key
    icon: <AccessTimeRounded fontSize="small" />,
  },
  {
    value: "dueDate",
    label: "sort.dueDate",
    icon: <CalendarTodayRounded fontSize="small" />,
  },
  {
    value: "alphabetical",
    label: "sort.alphabetical",
    icon: <SortByAlphaRounded fontSize="small" />,
  },
  {
    value: "custom",
    label: "sort.custom",
    icon: <MoveUpRounded fontSize="small" />,
  },
];

export const TaskSort = () => {
  const { sortOption, setSortOption, sortAnchorEl, setSortAnchorEl, moveMode } =
    useContext(TaskContext);
  const sortOpen = Boolean(sortAnchorEl);
  const { t } = useTranslation();

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = (option?: SortOption) => {
    setSortAnchorEl(null);
    if (option) {
      setSortOption(option);
    }
  };

  const currentSortOption = sortOptions.find((option) => option.value === sortOption);

  return (
    <>
      <SortButton
        onClick={handleSortClick}
        aria-controls={sortOpen ? "sort-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={sortOpen ? "true" : undefined}
        isMenuOpen={sortOpen}
        disabled={moveMode}
      >
        {currentSortOption?.icon}
        <ButtonContent>
          <SortLabel>{t("sort.sortBy")}</SortLabel>
          <SortValue>{currentSortOption ? t(currentSortOption.label) : ""}</SortValue>
        </ButtonContent>
      </SortButton>

      <Menu
        id="sort-menu"
        anchorEl={sortAnchorEl}
        open={sortOpen}
        onClose={() => handleSortClose()}
        slotProps={{
          list: {
            "aria-labelledby": "sort-button",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "18px",
            minWidth: "200px",
            boxShadow: "none",
            padding: "2px",
          },
        }}
      >
        {sortOptions.map(({ value, label, icon }) => (
          <StyledMenuItem
            key={value}
            onClick={() => handleSortClose(value)}
            selected={sortOption === value}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{t(label)}</ListItemText>
          </StyledMenuItem>
        ))}
      </Menu>
    </>
  );
};

const StyledMenuItem = styled(MenuItem)<{ clr?: string }>`
  margin: 0 6px;
  padding: 12px;
  border-radius: 12px;
  box-shadow: none;
  gap: 2px;
  color: ${({ clr }) => clr || "unset"};
`;

const SortButton = styled(Button)<{ isMenuOpen: boolean }>(({ isMenuOpen, theme }) => [
  {
    gap: "8px",
    textTransform: "none",
    borderRadius: "16px",
    height: "60px",
    padding: "16px 28px",
    background: isDark(theme.secondary) ? "#090b2258" : "#ffffff3e",
    color: getFontColor(theme.secondary),
    border: `1px solid ${isDark(theme.secondary) ? "#44479cb7" : theme.primary} !important`,
    transition: "width 0.2s ease",
  },
  isMenuOpen && {
    background: isDark(theme.secondary) ? "#090b228e" : "#ffffff8e",
    boxShadow: isDark(theme.secondary) ? "0 0 0 4px #1a1e4a7f" : `0 0 0 4px ${theme.primary}64`,
  },
  css`
    @media print {
      display: none !important;
    }
  `,
]);

const ButtonContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
`;

const SortLabel = styled(Typography)`
  font-size: 0.7rem;
  opacity: 0.7;
  line-height: 1;
`;

const SortValue = styled(Typography)`
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.1;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
