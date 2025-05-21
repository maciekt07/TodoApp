import React, { useContext } from "react";
import {
  AccessTimeRounded,
  CalendarTodayRounded,
  SortByAlphaRounded,
  SortRounded,
} from "@mui/icons-material";
import { Box, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { TaskContext } from "../../contexts/TaskContext";
import { SortButton } from "./tasks.styled";
import styled from "@emotion/styled";

export type SortOption = "dateCreated" | "dueDate" | "alphabetical";
//TODO: add more sort options
const sortOptions: {
  value: SortOption;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "dateCreated",
    label: "Date Created",
    icon: <AccessTimeRounded fontSize="small" />,
  },
  {
    value: "dueDate",
    label: "Due Date",
    icon: <CalendarTodayRounded fontSize="small" />,
  },
  {
    value: "alphabetical",
    label: "Alphabetical",
    icon: <SortByAlphaRounded fontSize="small" />,
  },
];

export const TaskSort = () => {
  const { sortOption, setSortOption, sortAnchorEl, setSortAnchorEl } = useContext(TaskContext);
  const sortOpen = Boolean(sortAnchorEl);

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = (option?: SortOption) => {
    setSortAnchorEl(null);
    if (option) {
      setSortOption(option);
    }
  };

  return (
    <>
      <SortButton
        onClick={handleSortClick}
        aria-controls={sortOpen ? "sort-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={sortOpen ? "true" : undefined}
        isMenuOpen={sortOpen}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            gap: "6px",
          }}
        >
          <SortRounded /> Sort
        </Box>
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
            <ListItemText>{label}</ListItemText>
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
