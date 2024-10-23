import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { DataObjectRounded, DeleteForeverRounded } from "@mui/icons-material";
import { ThemeProvider as MuiThemeProvider, type Theme } from "@mui/material";
import { useCallback, useContext, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { CustomToaster } from "./components/Toaster";
import { defaultUser } from "./constants/defaultUser";
import { UserContext } from "./contexts/UserContext";
import { useSystemTheme } from "./hooks/useSystemTheme";
import MainLayout from "./layouts/MainLayout";
import AppRouter from "./router";
import { GlobalStyles } from "./styles";
import { Themes, createCustomTheme } from "./theme/createTheme";
import { ColorPalette } from "./theme/themeConfig";
import { getFontColor, showToast } from "./utils";

function App() {
  const { user, setUser } = useContext(UserContext);
  const systemTheme = useSystemTheme();

  // Initialize user properties if they are undefined
  // this allows to add new properties to the user object without error
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateNestedProperties = (userObject: any, defaultObject: any) => {
      if (!userObject) {
        return defaultObject;
      }

      Object.keys(defaultObject).forEach((key) => {
        // Skip 'categories' key
        if (key === "categories") {
          return;
        }
        // Check if userObject has a different colorList array than defaultObject
        if (
          key === "colorList" &&
          user.colorList &&
          !defaultUser.colorList.every((element, index) => element === user.colorList[index])
        ) {
          return;
        }

        if (key === "settings" && Array.isArray(userObject.settings)) {
          // If the old settings is found, delete it
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
          // If the property is an object, recursively update nested properties
          userObject[key] = updateNestedProperties(userValue, defaultValue);
        } else if (userValue === undefined) {
          // Update only if the property is missing in user
          userObject[key] = defaultValue;
          // Notify users about update in user object
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

    // Update user with default values for all properties, including nested ones
    setUser((prevUser) => {
      // Make sure not to update if user hasn't changed
      if (
        JSON.stringify(prevUser) !==
        JSON.stringify(updateNestedProperties({ ...prevUser }, defaultUser))
      ) {
        return updateNestedProperties({ ...prevUser }, defaultUser);
      }
      return prevUser;
    });
  }, [setUser, user.colorList]);

  // This useEffect displays an native application badge count (for PWA) based on the number of tasks that are not done.
  // https://developer.mozilla.org/en-US/docs/Web/API/Badging_API
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
    // Function to display the application badge
    const displayAppBadge = async () => {
      if (user.settings.appBadge === true) {
        // Request permission for notifications
        if ((await Notification.requestPermission()) === "granted") {
          // Calculate the number of incomplete tasks
          const incompleteTasksCount = user.tasks.filter((task) => !task.done).length;
          // Update the app badge count if the value is a valid number
          if (!isNaN(incompleteTasksCount)) {
            setBadge(incompleteTasksCount);
          }
        }
      } else {
        clearBadge();
      }
    };
    // Check if the browser supports setting the app badge
    if ("setAppBadge" in navigator) {
      displayAppBadge();
    }
  }, [setUser, user.settings, user.tasks]);

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

  const isDarkMode = (): boolean => {
    switch (user.darkmode) {
      case "light":
        return false;
      case "dark":
        return true;
      case "system":
        return systemTheme === "dark";
      case "auto":
        return getFontColor(getMuiTheme().palette.secondary.main) === ColorPalette.fontLight;
      default:
        return false;
    }
  };

  // Update the theme color meta tag in the document's head based on the user's selected theme.
  useEffect(() => {
    document
      .querySelector("meta[name=theme-color]")
      ?.setAttribute("content", getMuiTheme().palette.secondary.main);
  }, [user.theme, getMuiTheme]);

  return (
    <MuiThemeProvider
      theme={createCustomTheme(
        getMuiTheme().palette.primary.main,
        getMuiTheme().palette.secondary.main,
        isDarkMode() ? "dark" : "light",
      )}
    >
      <EmotionThemeProvider
        theme={{
          primary: getMuiTheme().palette.primary.main,
          secondary: getMuiTheme().palette.secondary.main,
          darkmode: isDarkMode(),
        }}
      >
        <GlobalStyles />
        <CustomToaster />
        <ErrorBoundary>
          <MainLayout>
            <AppRouter />
          </MainLayout>
        </ErrorBoundary>
      </EmotionThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;
