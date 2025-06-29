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
} from "react";
import { CustomDialogTitle, TabGroupProvider, TabPanel } from "..";
import { UserContext } from "../../contexts/UserContext";
import { useResponsiveDisplay } from "../../hooks/useResponsiveDisplay";
import { CloseButton, CloseButtonContainer, StyledTab } from "./settings.styled";
import { fadeIn } from "../../styles";
import { useNavigate } from "react-router-dom";

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

interface SettingsProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({ open, onClose }: SettingsProps) => {
  const { user } = useContext(UserContext);

  const [tabValue, setTabValue] = useState<number>(0);
  const n = useNavigate();
  const isMobile = useResponsiveDisplay();
  const muiTheme = useTheme();

  const labelToSlug = (label: string) => label.replace(/\s+/g, "");

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    const tabSlug = labelToSlug(settingsTabs[newValue].label);
    window.location.hash = `#settings/${tabSlug}`;
  };

  // listens for changes in the URL hash and updates the selected tab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      // tab selection logic
      const match = hash.match(/^#settings\/(\w+)/);
      if (match) {
        const slug = match[1];
        const foundIndex = settingsTabs.findIndex((tab) => labelToSlug(tab.label) === slug);
        if (foundIndex !== -1) {
          setTabValue(foundIndex);
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [open, onClose]);

  // close dialog if hash no longer matches #settings/TabName
  useEffect(() => {
    const handleHashChange = () => {
      if (!/^#settings(\/\w+)?$/.test(window.location.hash)) {
        onClose();
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const hash = window.location.hash;
    const match = hash.match(/^#settings\/(\w+)/);
    // if the hash is just #settings or something invalid push the default tab
    if (!match) {
      const defaultTabSlug = labelToSlug(settingsTabs[0].label);
      window.location.hash = `#settings/${defaultTabSlug}`;
    }
  }, [open]);

  const handleDialogClose = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    onClose();
    // remove the full hash
    history.replaceState(null, "", window.location.pathname + window.location.search);
  };

  useEffect(() => {
    const themeColorMeta = document.querySelector("meta[name=theme-color]");
    const defaultThemeColor = muiTheme.palette.secondary.main;

    if (themeColorMeta) {
      if (open) {
        themeColorMeta.setAttribute(
          "content",
          muiTheme.palette.mode === "dark" ? "#383838" : "#ffffff",
        );
      } else {
        themeColorMeta.setAttribute("content", defaultThemeColor);
      }
    }
  }, [muiTheme.palette.mode, muiTheme.palette.secondary.main, open, user.theme, user.darkmode]);

  useEffect(() => {
    // close the dialog when pressing ctrl+p to print tasks
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        handleDialogClose();
        n("/");
        setTimeout(() => window.print(), 500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <TabPanel index={index} key={index} sx={{ animation: `${fadeIn} 0.3s ease-in` }}>
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
              </TabPanel>
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
