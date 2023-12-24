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
  MenuItem,
  SwipeableDrawer,
  Tooltip,
} from "@mui/material";
import { UserProps } from "../types/user";
import styled from "@emotion/styled";
import {
  Add,
  Category,
  Favorite,
  GetApp,
  GitHub,
  Logout,
  Person,
  Settings,
  TaskAlt,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { defaultUser } from "../constants/defaultUser";
import { SettingsDialog } from ".";
import toast from "react-hot-toast";
import logo from "../assets/logo256.png";
import { ColorPalette } from "../styles";

export const ProfileAvatar = ({ user, setUser }: UserProps) => {
  const n = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState<boolean>(false);

  const [openSettings, setOpenSettings] = useState<boolean>(false);

  const iOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    document.getElementById("root")?.setAttribute("aria-sidebar", "true");
  };
  const handleClose = () => {
    setAnchorEl(null);

    document.getElementById("root")?.removeAttribute("aria-sidebar");
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
    toast.success("You have been successfully logged out");
  };

  return (
    <Container>
      <Tooltip title={user.name || "User"}>
        <IconButton
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <Avatar
            src={(user.profilePicture as string) || undefined}
            onError={() => {
              setUser((prevUser) => ({
                ...prevUser,
                profilePicture: null,
              }));

              toast.error("Error in profile picture URL");
              throw new Error("Error in profile picture URL");
            }}
            sx={{
              width: "52px",
              height: "52px",
              background: "#747474",
              transition: ".2s all",
              fontSize: "26px",
              // WebkitTransform: "translate3d(0,0,0)",
            }}
          >
            {user.name ? user.name[0].toUpperCase() : undefined}
          </Avatar>
        </IconButton>
      </Tooltip>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        id="basic-menu"
        // anchorEl={anchorEl}
        anchor="right"
        open={open}
        onOpen={() => console.log("")}
        onClose={handleClose}
        // MenuListProps={{
        //   "aria-labelledby": "basic-button",
        // }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "24px 0 0 0",
            minWidth: "260px",
            boxShadow: "none",
            padding: "4px",
            background: "#F9FAFC",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            marginTop: "8px",
            gap: "16px",
            cursor: "pointer",
          }}
          onClick={() => {
            n("/");
            handleClose();
          }}
        >
          <img src={logo} alt="logo" style={{ width: "48px", marginLeft: "18px" }} />
          <h2>
            <span style={{ color: "#7764E8" }}>Todo</span> App
            <span style={{ color: "#7764E8" }}>.</span>
          </h2>
        </div>

        <StyledMenuItem
          onClick={() => {
            n("/");
            handleClose();
          }}
          sx={{ mt: "16px !important" }}
        >
          <TaskAlt /> &nbsp; Tasks
          {user.tasks.filter((task) => !task.done).length > 0 && (
            <MenuLabel clr={ColorPalette.purple}>
              {user.tasks.filter((task) => !task.done).length}
            </MenuLabel>
          )}
        </StyledMenuItem>
        <StyledMenuItem
          onClick={() => {
            n("/add");
            handleClose();
          }}
        >
          <Add /> &nbsp; Add Task
        </StyledMenuItem>
        <StyledMenuItem
          onClick={() => {
            n("/user");
            handleClose();
          }}
        >
          <Person /> &nbsp; Profile
        </StyledMenuItem>

        {user.settings[0].enableCategories !== undefined && user.settings[0].enableCategories && (
          <StyledMenuItem
            onClick={() => {
              n("/categories");
              handleClose();
            }}
          >
            <Category /> &nbsp; Categories
          </StyledMenuItem>
        )}
        <StyledMenuItem
          onClick={() => {
            n("/import-export");
            handleClose();
          }}
        >
          <GetApp /> &nbsp; Import/Export
        </StyledMenuItem>

        <Divider sx={{ margin: "0 8px" }} />
        <StyledMenuItem
          onClick={() => {
            window.open("https://github.com/maciekt07/TodoApp");
          }}
        >
          <GitHub /> &nbsp; Github
        </StyledMenuItem>

        <StyledMenuItem onClick={handleLogoutConfirmationOpen} sx={{ color: "#ff4040 !important" }}>
          <Logout /> &nbsp; Logout
        </StyledMenuItem>
        <div
          style={{
            marginTop: "auto",
            // marginLeft: "18px",
            marginBottom: iOS ? "38px" : "18px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <StyledMenuItem
            sx={{
              background: "#101727",
              color: "white !important",
              "&:hover": {
                background: "#101727db !important",
              },
            }}
            onClick={() => {
              setOpenSettings(true);
              handleClose();
            }}
          >
            <Settings /> &nbsp; Settings
          </StyledMenuItem>
          <Divider sx={{ margin: "0 8px" }} />
          <StyledMenuItem
            onClick={() => {
              n("/user");
              handleClose();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#d7d7d7",
            }}
          >
            <Avatar src={(user.profilePicture as string) || undefined}>
              {user.name ? user.name[0].toUpperCase() : undefined}
            </Avatar>
            <h4 style={{ margin: 0, fontWeight: 600 }}> {user.name || "User"}</h4>
          </StyledMenuItem>
          <span
            style={{
              fontSize: "12px",
              margin: "2px 8px",
              color: "#101727",
              opacity: 0.8,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ display: "flex", alignItems: "center" }}>
              Made with &nbsp; <Favorite sx={{ fontSize: "16px" }} />
            </span>
            <span style={{ marginLeft: "6px", marginRight: "4px" }}>by</span>{" "}
            <a
              style={{ textDecoration: "none", color: "inherit" }}
              href="https://github.com/maciekt07"
            >
              maciekt07
            </a>
          </span>
        </div>
      </SwipeableDrawer>

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
  top: 14px;
  z-index: 900;
  @media (max-width: 1024px) {
    right: 16px;
  }
`;
const StyledMenuItem = styled(MenuItem)`
  margin: 0px 8px;
  padding: 16px 12px;
  border-radius: 14px;
  box-shadow: none;
  display: flex;
  font-weight: 500;
  color: #101727;

  align-items: center;
  gap: 6px;

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

const MenuLabel = styled.span<{ clr: string }>`
  margin-left: auto;
  font-weight: 500;
  background: ${({ clr }) => clr + "45"};
  color: ${({ clr }) => clr};
  padding: 1px 12px;
  border-radius: 32px;
  font-size: 14px;
`;
