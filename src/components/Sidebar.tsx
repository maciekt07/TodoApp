import styled from "@emotion/styled";
import {
  AddRounded,
  AdjustRounded,
  BugReportRounded,
  CategoryRounded,
  DeleteForeverRounded,
  Favorite,
  FavoriteRounded,
  FiberManualRecord,
  GetAppRounded,
  GitHub,
  InstallDesktopRounded,
  InstallMobileRounded,
  Logout,
  SettingsRounded,
  StarRounded,
  TaskAltRounded,
} from "@mui/icons-material";
import {
  Avatar,
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
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsDialog } from ".";
import bmcLogo from "../assets/bmc-logo.svg";
import bmcLogoLight from "../assets/bmc-logo-light.svg";
import logo from "../assets/logo256.png";
import { defaultUser } from "../constants/defaultUser";
import { UserContext } from "../contexts/UserContext";
import { fetchBMCInfo } from "../services/bmcApi";
import { fetchGitHubInfo } from "../services/githubApi";
import { ColorPalette, DialogBtn, pulseAnimation, ring } from "../styles";
import { showToast, systemInfo, timeAgo } from "../utils";
import { useTheme } from "@emotion/react";

export const ProfileSidebar = () => {
  const { user, setUser } = useContext(UserContext);
  const n = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);

  const [stars, setStars] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [issuesCount, setIssuesCount] = useState<number | null>(null);

  const [bmcSupporters, setBmcSupporters] = useState<number | null>(null);

  const theme = useTheme();

  useEffect(() => {
    const fetchRepoInfo: () => Promise<void> = async () => {
      const { repoData, branchData } = await fetchGitHubInfo();
      setStars(repoData.stargazers_count);
      setLastUpdate(branchData.commit.commit.committer.date);
      setIssuesCount(repoData.open_issues_count);
    };

    const fetchBMC: () => Promise<void> = async () => {
      // Fetch data from the Buy Me a Coffee API
      const { supportersCount } = await fetchBMCInfo();
      // In case BMC api fails
      if (supportersCount > 0) {
        setBmcSupporters(supportersCount);
      } else {
        console.error("No BMC supporters found.");
      }
    };
    fetchBMC();
    fetchRepoInfo();
  }, []);

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
    showToast("You have been successfully logged out");
  };

  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: ReadonlyArray<string>;
    readonly userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>;
    prompt(): Promise<void>;
  }

  const [supportsPWA, setSupportsPWA] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);

  useEffect(() => {
    const beforeInstallPromptHandler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const detectAppInstallation = () => {
      window.matchMedia("(display-mode: standalone)").addEventListener("change", (e) => {
        setIsAppInstalled(e.matches);
      });
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    detectAppInstallation();

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    };
  }, []);

  const installPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          showToast("App installed successfully!");
          if ("setAppBadge" in navigator) {
            setUser((prevUser) => ({
              ...prevUser,
              settings: [
                {
                  ...prevUser.settings[0],
                  appBadge: true,
                },
              ],
            }));
          }
          handleClose();
        }
        if (choiceResult.outcome === "dismissed") {
          showToast("Installation dismissed.", { type: "error" });
        }
      });
    }
  };

  return (
    <Container>
      <Tooltip title={<div translate={user.name ? "no" : "yes"}>{user.name || "User"}</div>}>
        <IconButton
          aria-label="Sidebar"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{ zIndex: 1 }}
        >
          <Avatar
            src={(user.profilePicture as string) || undefined}
            alt={user.name || "User"}
            translate="no"
            slotProps={{ img: { loading: "lazy" } }}
            onError={() => {
              setUser((prevUser) => ({
                ...prevUser,
                profilePicture: null,
              }));

              showToast("Error in profile picture URL", { type: "error" });
              throw new Error("Error in profile picture URL");
            }}
            sx={{
              width: "52px",
              height: "52px",
              background: user.profilePicture ? "#ffffff1c" : "#747474",
              transition: ".2s all",
              fontSize: "26px",
            }}
          >
            {user.name ? user.name[0].toUpperCase() : undefined}
          </Avatar>
        </IconButton>
      </Tooltip>
      <StyledSwipeableDrawer
        disableBackdropTransition={systemInfo.os !== "iOS"}
        disableDiscovery={systemInfo.os === "iOS"}
        id="basic-menu"
        anchor="right"
        open={open}
        onOpen={(e) => e.preventDefault()}
        onClose={handleClose}
      >
        <LogoContainer
          translate="no"
          onClick={() => {
            n("/");
            handleClose();
          }}
        >
          <Logo src={logo} alt="logo" />
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
        >
          <TaskAltRounded /> &nbsp; Tasks
          {user.tasks.filter((task) => !task.done).length > 0 && (
            <Tooltip title={`${user.tasks.filter((task) => !task.done).length} tasks to do`}>
              <MenuLabel>
                {user.tasks.filter((task) => !task.done).length > 99
                  ? "99+"
                  : user.tasks.filter((task) => !task.done).length}
              </MenuLabel>
            </Tooltip>
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
            n("/purge");
            handleClose();
          }}
        >
          <DeleteForeverRounded /> &nbsp; Purge Tasks
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
            n("/transfer");
            handleClose();
          }}
        >
          <GetAppRounded /> &nbsp; Transfer
        </StyledMenuItem>

        <StyledDivider />
        <StyledMenuItem
          translate="no"
          onClick={() => {
            window.open("https://github.com/maciekt07/TodoApp");
          }}
        >
          <GitHub /> &nbsp; Github{" "}
          {stars && (
            <Tooltip title={`${stars} stars on Github`}>
              <MenuLabel clr="#ff9d00">
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <StarRounded style={{ fontSize: "18px" }} />
                  &nbsp;{stars}
                </span>
              </MenuLabel>
            </Tooltip>
          )}
        </StyledMenuItem>

        <StyledMenuItem
          onClick={() => {
            window.open("https://github.com/maciekt07/TodoApp/issues/new");
          }}
        >
          <BugReportRounded /> &nbsp; Report Issue{" "}
          {Boolean(issuesCount || issuesCount === 0) && (
            <Tooltip title={`${issuesCount} open issues`}>
              <MenuLabel clr={issuesCount && issuesCount > 0 ? ColorPalette.red : "#3bb61c"}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <AdjustRounded style={{ fontSize: "18px" }} />
                  &nbsp;
                  {issuesCount}
                </span>
              </MenuLabel>
            </Tooltip>
          )}
        </StyledMenuItem>

        <StyledMenuItem
          className="bmcMenu"
          onClick={() => {
            window.open("https://www.buymeacoffee.com/maciekt07");
          }}
        >
          <BmcIcon className="bmc-icon" src={theme.darkmode ? bmcLogoLight : bmcLogo} /> &nbsp; Buy
          me a coffee{" "}
          {bmcSupporters && (
            <Tooltip title={`${bmcSupporters} supporters on Buy me a coffee`}>
              <MenuLabel clr="#f93c58">
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FavoriteRounded style={{ fontSize: "16px" }} />
                  &nbsp;{bmcSupporters}
                </span>
              </MenuLabel>
            </Tooltip>
          )}
        </StyledMenuItem>

        <StyledDivider />

        {supportsPWA && !isAppInstalled && (
          <StyledMenuItem onClick={installPWA}>
            {systemInfo.os === "Android" ? <InstallMobileRounded /> : <InstallDesktopRounded />}
            &nbsp; Install App
          </StyledMenuItem>
        )}

        <StyledMenuItem onClick={handleLogoutConfirmationOpen} sx={{ color: "#ff4040 !important" }}>
          <Logout /> &nbsp; Logout
        </StyledMenuItem>

        <ProfileOptionsBottom
          isMobile={
            window.matchMedia("(display-mode: standalone)").matches &&
            /Mobi/.test(navigator.userAgent)
          }
        >
          <SettingsMenuItem
            onClick={() => {
              setOpenSettings(true);
              handleClose();
            }}
          >
            <SettingsRounded /> &nbsp; Settings
            {user.settings[0] === defaultUser.settings[0] && <PulseMenuLabel />}
          </SettingsMenuItem>
          <StyledDivider />
          <ProfileMenuItem
            translate={user.name ? "no" : "yes"}
            onClick={() => {
              n("/user");
              handleClose();
            }}
          >
            <Avatar
              src={(user.profilePicture as string) || undefined}
              sx={{ width: "44px", height: "44px" }}
              slotProps={{ img: { loading: "lazy" } }}
            >
              {user.name ? user.name[0].toUpperCase() : undefined}
            </Avatar>
            <h4 style={{ margin: 0, fontWeight: 600 }}> {user.name || "User"}</h4>{" "}
            {(user.name === null || user.name === "") &&
              user.profilePicture === null &&
              user.theme! == defaultUser.theme && <PulseMenuLabel />}
          </ProfileMenuItem>
          <StyledDivider />
          <CreditsContainer translate="no">
            <span style={{ display: "flex", alignItems: "center" }}>
              Made with &nbsp;
              <Favorite sx={{ fontSize: "14px" }} />
            </span>
            <span style={{ marginLeft: "6px", marginRight: "4px" }}>by</span>
            <a
              style={{ textDecoration: "none", color: "inherit" }}
              href="https://github.com/maciekt07"
            >
              maciekt07
            </a>
          </CreditsContainer>
          <CreditsContainer>
            {lastUpdate && (
              <Tooltip title={timeAgo(new Date(lastUpdate))}>
                <span>
                  Last update:{" "}
                  {new Intl.DateTimeFormat(navigator.language, {
                    dateStyle: "long",
                    timeStyle: "medium",
                  }).format(new Date(lastUpdate))}
                </span>
              </Tooltip>
            )}
          </CreditsContainer>
        </ProfileOptionsBottom>
      </StyledSwipeableDrawer>

      <Dialog open={logoutConfirmationOpen} onClose={handleLogoutConfirmationClose}>
        <DialogTitle>Logout Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to logout? <b>Your tasks will not be saved.</b>
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={handleLogoutConfirmationClose}>Cancel</DialogBtn>
          <DialogBtn onClick={handleLogout} color="error">
            <Logout /> &nbsp; Logout
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
    color: ${({ theme }) => (theme.darkmode ? ColorPalette.fontLight : "#101727")};
    z-index: 999;

    @media (min-width: 1920px) {
      min-width: 320px;
    }

    @media (max-width: 1024px) {
      min-width: 280px;
    }

    @media (max-width: 600px) {
      min-width: 56vw;
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
  /* color: #101727; */
  align-items: center;
  gap: 6px;

  & svg,
  .bmc-icon {
    transition: 0.4s transform;
  }

  &:hover {
    & svg[data-testid="GitHubIcon"] {
      transform: rotateY(${2 * Math.PI}rad);
    }
    & svg[data-testid="BugReportRoundedIcon"] {
      transform: rotate(45deg) scale(0.9) translateY(-20%);
    }
    & .bmc-icon {
      animation: ${ring} 2.5s ease-in alternate;
    }
  }
`;

const SettingsMenuItem = styled(StyledMenuItem)`
  background: ${({ theme }) => (theme.darkmode ? "#1f1f1f" : "#101727")};
  color: ${ColorPalette.fontLight} !important;
  margin-top: 8px !important;
  &:hover {
    background: ${({ theme }) => (theme.darkmode ? "#1f1f1fb2" : "#101727b2")};
    & svg[data-testid="SettingsRoundedIcon"] {
      transform: rotate(180deg);
    }
  }
`;

const ProfileMenuItem = styled(StyledMenuItem)`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme }) => (theme.darkmode ? "#1f1f1f" : "#d7d7d7")};
  &:hover {
    background: ${({ theme }) => (theme.darkmode ? "#1f1f1fb2" : "#d7d7d7b2")};
  }
`;

const MenuLabel = styled.span<{ clr?: string }>`
  margin-left: auto;
  font-weight: 600;
  background: ${({ clr, theme }) => (clr || theme.primary) + "35"};
  color: ${({ clr, theme }) => clr || theme.primary};
  padding: 2px 12px;
  border-radius: 32px;
  font-size: 14px;
`;

const StyledDivider = styled(Divider)`
  margin: 0 8px;
`;

const PulseMenuLabel = styled(MenuLabel)`
  animation: ${({ theme }) => pulseAnimation(theme.primary, 6)} 1.2s infinite;
  padding: 6px;
  margin-right: 4px;
`;

PulseMenuLabel.defaultProps = {
  children: (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FiberManualRecord style={{ fontSize: "16px" }} />
    </div>
  ),
};

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 8px;
  margin-bottom: 16px;
  gap: 16px;
  cursor: pointer;
`;

const BmcIcon = styled.img`
  width: 1em;
  height: 1em;
  font-size: 1.5rem;
`;

const Logo = styled.img`
  width: 52px;
  height: 52px;
  margin-left: 18px;
  border-radius: 14px;
`;

const ProfileOptionsBottom = styled.div<{ isMobile: boolean }>`
  margin-top: auto;
  margin-bottom: ${({ isMobile }) => (isMobile ? "38px" : "16px")};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CreditsContainer = styled.div`
  font-size: 12px;
  margin: 0;
  /* color: #101727c0; */
  opacity: 0.8;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;
