import { useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { UserProps } from "../types/user";
import styled from "@emotion/styled";
import {
  Category,
  Logout,
  ManageAccounts,
  Settings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { defaultUser } from "../constants/defaultUser";
import { SettingsDialog } from ".";

export const ProfileAvatar = ({ user, setUser }: UserProps) => {
  const n = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] =
    useState<boolean>(false);

  const [openSettings, setOpenSettings] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogoutConfirmationOpen = () => {
    setLogoutConfirmationOpen(true);
    setAnchorEl(null);
  };

  const handleLogoutConfirmationClose = () => {
    setLogoutConfirmationOpen(false);
  };

  const handleLogout = () => {
    setUser(defaultUser);
    handleLogoutConfirmationClose();
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
            src={user.profilePicture || ""}
            onError={() => {
              setUser({ ...user, profilePicture: null });
              throw new Error("Error in profile picture URL");
            }}
            sx={{
              width: "52px",
              height: "52px",
              background: "#747474",
              transition: ".2s all",
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
            minWidth: "172px",
            boxShadow: "none",
            padding: "2px 4px",
          },
        }}
      >
        <StyledMenuItem onClick={() => n("/user")}>
          <ManageAccounts /> &nbsp; Profile
        </StyledMenuItem>
        <StyledMenuItem
          onClick={() => {
            setOpenSettings(true);
            handleClose();
          }}
        >
          <Settings /> &nbsp; Settings
        </StyledMenuItem>
        {user.settings[0].enableCategories !== undefined &&
          user.settings[0].enableCategories && (
            <StyledMenuItem onClick={() => n("/categories")}>
              <Category /> &nbsp; Categories
            </StyledMenuItem>
          )}
        <Divider />
        <StyledMenuItem
          onClick={handleLogoutConfirmationOpen}
          sx={{ color: "#ff4040" }}
        >
          <Logout /> &nbsp; Logout
        </StyledMenuItem>
      </Menu>

      <Dialog
        open={logoutConfirmationOpen}
        onClose={handleLogoutConfirmationClose}
        PaperProps={{
          style: {
            borderRadius: "24px",
            padding: "10px",
          },
        }}
      >
        <DialogTitle>Logout Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to logout? <b>Your tasks will not be saved.</b>
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={handleLogoutConfirmationClose}>Cancel</DialogBtn>
          <DialogBtn onClick={handleLogout} color="error">
            Logout
          </DialogBtn>
        </DialogActions>
      </Dialog>
      <SettingsDialog
        open={openSettings}
        onClose={() => setOpenSettings(!openSettings)}
        user={user}
        setUser={setUser}
      />
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
  padding: 10px 12px;
  border-radius: 14px;
  box-shadow: none;

  &:hover {
    background-color: #f0f0f0;
  }
`;
const DialogBtn = styled(Button)`
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 16px;
  margin: 8px;
`;
