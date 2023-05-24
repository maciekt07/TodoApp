import { useState } from "react";
import {
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { UserProps } from "../types/user";
import styled from "@emotion/styled";
import { Logout, ManageAccounts } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { defaultUser } from "../constants/defaultUser";

export const ProfileAvatar = ({ user, setUser }: UserProps) => {
  const n = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Container>
      <Tooltip title={user.name || "user"}>
        <IconButton
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <Avatar
            sx={{
              width: "48px",
              height: "48px",
              background: "#8e8e8e",
              transition: ".2s all",

              // "&:hover": { transform: "scale(1.05)" },
            }}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "18px",
            minWidth: "150px",
            boxShadow: "none",
            padding: "2px",
          },
        }}
      >
        <StyledMenuItem onClick={() => n("/user")}>
          <ManageAccounts /> &nbsp; Profile
        </StyledMenuItem>
        <Divider />
        <StyledMenuItem
          onClick={() => setUser(defaultUser)}
          sx={{ color: "#ff4040" }}
        >
          <Logout /> &nbsp; Logout
        </StyledMenuItem>
      </Menu>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  right: 16vw;
  @media (max-width: 1024px) {
    right: 16px;
  }
`;
const StyledMenuItem = styled(MenuItem)`
  margin: 6px;
  padding: 8px;
  border-radius: 8px;
  box-shadow: none;

  &:hover {
    background-color: #f0f0f0;
  }
`;
