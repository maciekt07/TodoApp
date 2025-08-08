import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { DataObjectRounded, DeleteForeverRounded } from "@mui/icons-material";
import { ThemeProvider as MuiThemeProvider, type Theme } from "@mui/material";
import { useCallback, useContext, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import MainLayout from "./layouts/MainLayout";
import { CustomToaster } from "./components/Toaster";
import { defaultUser } from "./constants/defaultUser";
import { UserContext } from "./contexts/UserContext";
import { useSystemTheme } from "./hooks/useSystemTheme";
import AppRouter from "./router";
import { GlobalStyles } from "./styles";
import { Themes, createCustomTheme, isDarkMode } from "./theme/createTheme";
import { showToast } from "./utils";
import { GlobalQuickSaveHandler } from "./components/GlobalQuickSaveHandler";
import type { Category, UUID } from "./types/user";

function App() {
  const { user, setUser } = useContext(UserContext);
  const systemTheme = useSystemTheme();

  // Initialize user properties if they are undefined
  // this allows to add new properties to the user object without error
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateNestedProperties = (userObject: any, defaultObject: any): any => {
      if (!userObject) return defaultObject;

      Object.keys(defaultObject).forEach((key) => {
        if (key === "categories") return;

        if (
          key === "colorList" &&
          userObject.colorList &&
          !defaultUser.colorList.every((element, index) => element === userObject.colorList[index])
        ) {
          return;
        }

        if (key === "favoriteCategories" && Array.isArray(userObject.favoriteCategories)) {
          userObject.favoriteCategories = userObject.favoriteCategories.filter((id: UUID) =>
            userObject.categories.some((cat: Category) => cat.id === id),
          );
          return;
        }

        if (key === "settings" && Array.isArray(userObject.settings)) {
          delete userObject.settings;
          showToast("Removed old settings array format.", {
            duration: 6000,
            icon: <DeleteForeverRounded />,
            disableVibrate: true,
          });
        }

        const userValue = userObject[key];
        const defaultValue = defaultObject[key];

        if (typeof defaultValue === "object" && defaultValue !== null) {
          userObject[key] = updateNestedProperties(userValue, defaultValue);
        } else if (userValue === undefined) {
          userObject[key] = defaultValue;
          showToast(
            <div>
              Added new property to user object{" "}
              <i translate="no">
                {key.toString()}: {userObject[key].toString()}
              </i>
            </div>,
            {
              duration: 6000,
              icon: <DataObjectRounded />,
              disableVibrate: true,
            },
          );
        }
      });

      return userObject;
    };

    setUser((prevUser) => {
      const updatedUser = updateNestedProperties({ ...prevUser }, defaultUser);
      return prevUser !== updatedUser ? updatedUser : prevUser;
    });
  }, [setUser]);

  useEffect(() => {
    const setBadge = async (count: number) => {
      if ("setAppBadge" in navigator) {
        try {
          await navigator.setAppBadge(count);
        } catch (error) {
          console.error("Failed to set app badge:", error);
        }
      }
    };

    const clearBadge = async () => {
      if ("clearAppBadge" in navigator) {
        try {
          await navigator.clearAppBadge();
        } catch (error) {
          console.error("Failed to clear app badge:", error);
        }
      }
    };

    const displayAppBadge = async () => {
      if (user.settings.appBadge) {
        if ((await Notification.requestPermission()) === "granted") {
          const incompleteTasksCount = user.tasks.filter((task) => !task.done).length;
          if (!isNaN(incompleteTasksCount)) {
            setBadge(incompleteTasksCount);
          }
        }
      } else {
        clearBadge();
      }
    };

    if ("setAppBadge" in navigator) {
      displayAppBadge();
    }
  }, [user.settings.appBadge, user.tasks]);

  const getMuiTheme = useCallback((): Theme => {
    if (systemTheme === "unknown") {
      return Themes[0].MuiTheme;
    }
    if (user.theme === "system") {
      return systemTheme === "dark" ? Themes[0].MuiTheme : Themes[1].MuiTheme;
    }
    const selectedTheme = Themes.find((theme) => theme.name === user.theme);
    return selectedTheme ? selectedTheme.MuiTheme : Themes[0].MuiTheme;
  }, [systemTheme, user.theme]);

  useEffect(() => {
    const themeColorMeta = document.querySelector("meta[name=theme-color]");
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", getMuiTheme().palette.secondary.main);
    }
  }, [user.theme, getMuiTheme]);

  return (
    <MuiThemeProvider
      theme={createCustomTheme(
        getMuiTheme().palette.primary.main,
        getMuiTheme().palette.secondary.main,
        isDarkMode(user.darkmode, systemTheme, getMuiTheme().palette.secondary.main)
          ? "dark"
          : "light",
      )}
    >
      <EmotionThemeProvider
        theme={{
          primary: getMuiTheme().palette.primary.main,
          secondary: getMuiTheme().palette.secondary.main,
          darkmode: isDarkMode(user.darkmode, systemTheme, getMuiTheme().palette.secondary.main),
          mui: getMuiTheme(),
          reduceMotion: user.settings.reduceMotion || "system",
        }}
      >
        <GlobalStyles />
        <CustomToaster />
        <ErrorBoundary>
          <MainLayout>
            <GlobalQuickSaveHandler>
              <AppRouter />
            </GlobalQuickSaveHandler>
          </MainLayout>
        </ErrorBoundary>
      </EmotionThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;
