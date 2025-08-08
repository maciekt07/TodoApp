import {
  EmojiEmotionsRounded,
  InfoRounded,
  KeyboardCommandKeyRounded,
  PaletteRounded,
  RecordVoiceOverRounded,
  SettingsRounded,
} from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  Tabs,
  useTheme,
} from "@mui/material";
import {
  JSX,
  lazy,
  LazyExoticComponent,
  ReactElement,
  Suspense,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { CustomDialogTitle, TabGroupProvider } from "..";
import { UserContext } from "../../contexts/UserContext";
import { useResponsiveDisplay } from "../../hooks/useResponsiveDisplay";
import { CloseButton, CloseButtonContainer, StyledTab, StyledTabPanel } from "./settings.styled";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils";

const settingsTabs: {
  label: string;
  icon: ReactElement;
  Component: LazyExoticComponent<() => JSX.Element>;
}[] = [
  {
    label: "Appearance",
    icon: <PaletteRounded />,
    Component: lazy(() => import("./tabs/AppearanceTab")),
  },
  {
    label: "General",
    icon: <SettingsRounded />,
    Component: lazy(() => import("./tabs/GeneralTab")),
  },
  {
    label: "Emoji",
    icon: <EmojiEmotionsRounded />,
    Component: lazy(() => import("./tabs/EmojiTab")),
  },
  {
    label: "Read Aloud",
    icon: <RecordVoiceOverRounded />,
    Component: lazy(() => import("./tabs/ReadAloudTab")),
  },
  {
    label: "Shortcuts",
    icon: <KeyboardCommandKeyRounded />,
    Component: lazy(() => import("./tabs/ShortcutsTab")),
  },
  {
    label: "About",
    icon: <InfoRounded />,
    Component: lazy(() => import("./tabs/AboutTab")),
  },
];

// hash routing utils
const createTabSlug = (label: string): string => label.replace(/\s+/g, "");

const navigateToTab = (tabIndex: number): void => {
  const tabSlug = createTabSlug(settingsTabs[tabIndex].label);
  window.location.hash = `#settings/${tabSlug}`;
};

const replaceWithTab = (tabIndex: number): void => {
  const tabSlug = createTabSlug(settingsTabs[tabIndex].label);
  history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}#settings/${tabSlug}`,
  );
};

const isSettingsHash = (hash: string): boolean => /^#settings(\/.*)?$/.test(hash);

interface SettingsProps {
  open: boolean;
  onClose: () => void;
  handleOpen: () => void;
}

export const SettingsDialog = ({ open, onClose, handleOpen }: SettingsProps) => {
  const { user } = useContext(UserContext);
  const [tabValue, setTabValue] = useState<number>(0);
  const navigate = useNavigate();
  const isMobile = useResponsiveDisplay();
  const muiTheme = useTheme();

  const handleDialogClose = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    onClose();
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }, [onClose]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    navigateToTab(newValue);
  };

  // validate tab
  const handleHashChange = useCallback(() => {
    const hash = window.location.hash;

    if (!isSettingsHash(hash)) {
      onClose();
      return;
    }

    if (hash === "#settings" || hash === "#settings/") {
      replaceWithTab(0);
      setTabValue(0);
      return;
    }

    const match = hash.match(/^#settings\/(\w+)/);
    if (!match) return -1;

    const slug = match[1];
    const tabIndex = settingsTabs.findIndex((tab) => createTabSlug(tab.label) === slug);

    if (tabIndex !== -1) {
      setTabValue(tabIndex);
    } else {
      const invalidSlug = hash.match(/^#settings\/(\w+)/)?.[1];
      if (invalidSlug) {
        showToast(`Invalid settings tab: "${invalidSlug}". Redirecting to default tab.`, {
          type: "error", // TODO: add warning type
        });
        replaceWithTab(0);
        setTabValue(0);
      }
    }
  }, [onClose]);

  const handleHashOpen = useCallback(() => {
    if (window.location.hash.startsWith("#settings")) {
      handleOpen();
    }
  }, [handleOpen]);

  useEffect(() => {
    const onHashChange = () => {
      handleHashChange();
      handleHashOpen();
    };

    onHashChange();

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [handleHashChange, handleHashOpen]);

  useEffect(() => {
    if (open) {
      const hash = window.location.hash;
      if (!isSettingsHash(hash)) {
        navigateToTab(0);
      }
    }
  }, [open]);

  // theme color management
  useEffect(() => {
    const themeColorMeta = document.querySelector("meta[name=theme-color]");
    const defaultThemeColor = muiTheme.palette.secondary.main;

    if (themeColorMeta) {
      // ensure this runs after App.tsx useEffect to override theme-color
      setTimeout(() => {
        if (open) {
          themeColorMeta.setAttribute(
            "content",
            muiTheme.palette.mode === "dark" ? "#383838" : "#ffffff",
          );
        } else {
          themeColorMeta.setAttribute("content", defaultThemeColor);
        }
      }, 10);
    }
  }, [muiTheme.palette.mode, muiTheme.palette.secondary.main, open, user.theme, user.darkmode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        handleDialogClose();
        navigate("/");
        setTimeout(() => window.print(), 500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, handleDialogClose]);

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      slotProps={{
        paper: {
          style: {
            padding: isMobile ? "12px 0" : "12px",
            borderRadius: isMobile ? 0 : "24px",
            minWidth: "400px",
            maxHeight: isMobile ? undefined : "500px",
            overflow: "hidden",
          },
        },
      }}
    >
      <CustomDialogTitle
        icon={<SettingsRounded />}
        title="Settings"
        subTitle="Manage Your settings and preferences"
        onClose={handleDialogClose}
        removeDivider
      />
      <Divider sx={{ mb: 2 }} />
      <DialogContent sx={{ display: "flex", minHeight: 400, m: 0, p: 0, overflow: "hidden" }}>
        <Tabs
          orientation="vertical"
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          aria-label="Settings tabs"
          sx={{
            borderRight: 1,
            borderColor: "divider",
          }}
        >
          {settingsTabs.map((tab, index) => (
            <StyledTab icon={tab.icon} label={tab.label} {...a11yProps(index)} key={index} />
          ))}
        </Tabs>
        <Box
          className="customScrollbar"
          sx={{ flex: 1, p: 0, m: isMobile ? "0 12px" : "0 20px 0 20px", overflowY: "auto" }}
        >
          <TabGroupProvider value={tabValue} name="settings">
            {settingsTabs.map((tab, index) => (
              <StyledTabPanel index={index} key={index}>
                {tabValue === index && (
                  <Suspense
                    fallback={
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        minHeight={isMobile ? 150 : 400}
                      >
                        <CircularProgress size={48} />
                      </Box>
                    }
                  >
                    <tab.Component />
                  </Suspense>
                )}
              </StyledTabPanel>
            ))}
          </TabGroupProvider>
        </Box>
      </DialogContent>
      {isMobile && (
        <CloseButtonContainer>
          <CloseButton variant="contained" onClick={handleDialogClose}>
            Close
          </CloseButton>
        </CloseButtonContainer>
      )}
    </Dialog>
  );
};

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}
