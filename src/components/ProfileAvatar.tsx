import { useContext, useEffect, useState } from "react";
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
import styled from "@emotion/styled";
import {
  AddRounded,
  CategoryRounded,
  Favorite,
  GetAppRounded,
  GitHub,
  Logout,
  PersonRounded,
  SettingsRounded,
  StarRounded,
  TaskAltRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { defaultUser } from "../constants/defaultUser";
import { SettingsDialog } from ".";
import toast from "react-hot-toast";
import logo from "../assets/logo256.png";
import { ColorPalette } from "../styles";
import { UserContext } from "../contexts/UserContext";
import { iOS } from "../utils/iOS";

export const ProfileAvatar = () => {
  const { user, setUser } = useContext(UserContext);
  const n = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);

  const [stars, setStars] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepoInfo = async () => {
      const username = "maciekt07";
      const repo = "TodoApp";
      const branch = "gh-pages";
      try {
        // Make a request to the GitHub API for repository and branch information
        const [repoResponse, branchResponse] = await Promise.all([
          fetch(`https://api.github.com/repos/${username}/${repo}`),
          fetch(`https://api.github.com/repos/${username}/${repo}/branches/${branch}`),
        ]);

        // Check if both requests were successful
        if (repoResponse.ok && branchResponse.ok) {
          const [repoData, branchData] = await Promise.all([
            repoResponse.json(),
            branchResponse.json(),
          ]);

          // Get the number of stars
          setStars(repoData.stargazers_count);

          // Get the 'committer' information
          setLastUpdate(branchData.commit.commit.committer.date);
        } else {
          throw new Error("Failed to fetch repository information");
        }
      } catch (error) {
        console.error(error);
      }
    };

    // Call the fetch function
    fetchRepoInfo();
  }, []);

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
      <Tooltip title={user.name || "User"} translate="no">
        <IconButton
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <Avatar
            src={(user.profilePicture as string) || undefined}
            alt={user.name || "User"}
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
      <StyledSwipeableDrawer
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
      >
        <LogoContainer
          translate="no"
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
        </LogoContainer>

        <StyledMenuItem
          onClick={() => {
            n("/");
            handleClose();
          }}
          sx={{ mt: "16px !important" }}
        >
          <TaskAltRounded /> &nbsp; Tasks
          {user.tasks.filter((task) => !task.done).length > 0 && (
            <MenuLabel clr={ColorPalette.purple}>
              {user.tasks.filter((task) => !task.done).length > 99
                ? "99+"
                : user.tasks.filter((task) => !task.done).length}
            </MenuLabel>
          )}
        </StyledMenuItem>
        <StyledMenuItem
          onClick={() => {
            n("/add");
            handleClose();
          }}
        >
          <AddRounded /> &nbsp; Add Task
        </StyledMenuItem>
        <StyledMenuItem
          onClick={() => {
            n("/user");
            handleClose();
          }}
        >
          <PersonRounded /> &nbsp; Profile
        </StyledMenuItem>

        {user.settings[0].enableCategories !== undefined && user.settings[0].enableCategories && (
          <StyledMenuItem
            onClick={() => {
              n("/categories");
              handleClose();
            }}
          >
            <CategoryRounded /> &nbsp; Categories
          </StyledMenuItem>
        )}
        <StyledMenuItem
          onClick={() => {
            n("/import-export");
            handleClose();
          }}
        >
          <GetAppRounded /> &nbsp; Import/Export
        </StyledMenuItem>

        <Divider sx={{ margin: "0 8px" }} />
        <StyledMenuItem
          onClick={() => {
            window.open("https://github.com/maciekt07/TodoApp");
          }}
        >
          <GitHub /> &nbsp; Github{" "}
          {stars && (
            <MenuLabel clr="#ff9d00">
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <StarRounded style={{ fontSize: "18px" }} />
                &nbsp;{stars}
              </span>
            </MenuLabel>
          )}
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
            <SettingsRounded /> &nbsp; Settings
          </StyledMenuItem>
          <Divider sx={{ margin: "0 8px" }} />
          <StyledMenuItem
            translate="no"
            onClick={() => {
              n("/user");
              handleClose();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#d7d7d7",
              // marginBottom: "12px",
            }}
          >
            <Avatar src={(user.profilePicture as string) || undefined}>
              {user.name ? user.name[0].toUpperCase() : undefined}
            </Avatar>
            <h4 style={{ margin: 0, fontWeight: 600 }}> {user.name || "User"}</h4>
          </StyledMenuItem>
          <Divider sx={{ margin: "0 8px" }} />
          <CreditsContainer>
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
            <br />
          </CreditsContainer>
          <CreditsContainer>
            {lastUpdate && (
              <span style={{ margin: 0 }}>
                Last Update: {new Date(lastUpdate).toLocaleDateString()}
                {" • "}
                {new Date(lastUpdate).toLocaleTimeString()}
              </span>
            )}
          </CreditsContainer>
        </div>
      </StyledSwipeableDrawer>

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
      <SettingsDialog open={openSettings} onClose={() => setOpenSettings(!openSettings)} />
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

const StyledSwipeableDrawer = styled(SwipeableDrawer)`
  & .MuiPaper-root {
    border-radius: 24px 0 0 0;
    min-width: 300px;
    box-shadow: none;
    padding: 4px;
    background: #f9fafc;
    @media (max-width: 1024px) {
      min-width: 270px;
    }
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
  font-weight: 600;
  background: ${({ clr }) => clr + "35"};
  color: ${({ clr }) => clr};
  padding: 2px 12px;
  border-radius: 32px;
  font-size: 14px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 8px;
  gap: 16px;
  cursor: pointer;
`;

const CreditsContainer = styled.div`
  font-size: 12px;
  margin: 0;
  color: #101727;
  opacity: 0.8;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;
