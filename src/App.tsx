import { useStorageState } from "./hooks/useStorageState";
import { defaultUser } from "./constants/defaultUser";
import type { User } from "./types/user";
import { ColorPalette, GlobalStyles, Themes } from "./styles";
import { ThemeProvider } from "@mui/material";
import { useCallback, useEffect } from "react";
import { ErrorBoundary } from "./components";
import MainLayout from "./layouts/MainLayout";
import AppRouter from "./router";
import { Toaster } from "react-hot-toast";
import { useResponsiveDisplay } from "./hooks/useResponsiveDisplay";
import { UserContext } from "./contexts/UserContext";
import { DataObjectRounded } from "@mui/icons-material";
import { ThemeProvider as EmotionTheme } from "@emotion/react";
import { useSystemTheme } from "./hooks/useSystemTheme";
import { getFontColor, showToast } from "./utils";

function App() {
  const [user, setUser] = useStorageState<User>(defaultUser, "user");
  const isMobile = useResponsiveDisplay();
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
        if (key === "categories") {
          return;
        }

        if (
          key === "colorList" &&
          user.colorList &&
          !defaultUser.colorList.every((element, index) => element === user.colorList[index])
        ) {
          return;
        }

        const userValue = userObject[key];
        const defaultValue = defaultObject[key];

        if (typeof defaultValue === "object" && defaultValue !== null) {
          // If the property is an object, recursively update nested properties
          userObject[key] = updateNestedProperties(userValue, defaultValue);
        } else if (userValue === undefined) {
          // Update only if the property is missing in user
          userObject[key] = defaultValue;
          // Notify users about update
          showToast(
            <div>
              Added new property to user object{" "}
              <i>
                {key}: {userObject[key].toString()}
              </i>
            </div>,
            {
              duration: 6000,
              icon: <DataObjectRounded />,
            }
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
    const setBadge = (...args: number[]) => {
      if (navigator.setAppBadge) {
        navigator.setAppBadge(...args);
      }
    };
    // Function to display the application badge
    const displayAppBadge = async () => {
      if (user.settings[0].appBadge === true) {
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
        navigator.clearAppBadge && navigator.clearAppBadge();
      }
    };
    // Check if the browser supports setting the app badge
    if ("setAppBadge" in navigator) {
      displayAppBadge();
    }
  }, [setUser, user.settings, user.tasks]);

  const getMuiTheme = useCallback(() => {
    if (systemTheme === "unknown") {
      return Themes[0].MuiTheme;
    }
    if (user.theme === "system") {
      return systemTheme === "dark" ? Themes[0].MuiTheme : Themes[1].MuiTheme;
    }
    const selectedTheme = Themes.find((theme) => theme.name === user.theme);
    return selectedTheme ? selectedTheme.MuiTheme : Themes[0].MuiTheme;
  }, [systemTheme, user.theme]);

  const getSecondaryColor = useCallback(() => {
    const theme = getMuiTheme();
    return theme.palette.secondary.main;
  }, [getMuiTheme]);

  const getPrimaryColor = () => {
    const theme = getMuiTheme();
    return theme.palette.primary.main;
  };

  // Update the theme color meta tag in the document's head based on the user's selected theme.
  useEffect(() => {
    document.querySelector("meta[name=theme-color]")?.setAttribute("content", getSecondaryColor());
  }, [user.theme, getSecondaryColor]);

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <EmotionTheme theme={{ primary: getPrimaryColor(), secondary: getSecondaryColor() }}>
        <GlobalStyles />
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={12}
          containerStyle={{
            marginBottom: isMobile ? "96px" : "12px",
          }}
          toastOptions={{
            position: "bottom-center",
            duration: 3800,
            style: {
              padding: "14px 22px",
              borderRadius: "18px",
              fontSize: "17px",
              border: `2px solid ${getPrimaryColor()}`,
              background: "#141431e0",
              WebkitBackdropFilter: "blur(6px)",
              backdropFilter: "blur(6px)",
              color: ColorPalette.fontLight,
            },
            success: {
              iconTheme: {
                primary: getPrimaryColor(),
                secondary: getFontColor(getPrimaryColor()),
              },
            },
            error: {
              iconTheme: {
                primary: ColorPalette.red,
                secondary: "white",
              },
              style: {
                borderColor: ColorPalette.red,
              },
            },
          }}
        />
        <UserContext.Provider value={{ user, setUser }}>
          <ErrorBoundary>
            <MainLayout>
              <AppRouter />
            </MainLayout>
          </ErrorBoundary>
        </UserContext.Provider>
      </EmotionTheme>
    </ThemeProvider>
  );
}

export default App;
