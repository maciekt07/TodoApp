import { useStorageState } from "./hooks/useStorageState";
import { defaultUser } from "./constants/defaultUser";
import { User } from "./types/user";
import { ColorPalette, GlobalStyles, MuiTheme } from "./styles";
import { ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { ErrorBoundary } from "./components";
import { MainLayout } from "./layouts/MainLayout";
import { AppRouter } from "./router";
import { Toaster } from "react-hot-toast";
import { useResponsiveDisplay } from "./hooks/useResponsiveDisplay";

function App() {
  const [user, setUser] = useStorageState<User>(defaultUser, "user");
  const isMobile = useResponsiveDisplay();
  // Initialize user properties if they are undefined
  useEffect(() => {
    if (user.categories === undefined) {
      setUser({ ...user, categories: defaultUser.categories });
    }
    if (
      user.settings === undefined ||
      user.settings[0].enableCategories === undefined ||
      user.settings[0].enableGlow === undefined ||
      user.settings[0] === undefined
    ) {
      setUser({ ...user, settings: defaultUser.settings });
    }
  }, []);
  const userProps = { user, setUser };

  return (
    <>
      <ThemeProvider theme={MuiTheme}>
        <GlobalStyles />
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={12}
          containerStyle={{
            marginBottom: isMobile ? "84px" : "12px",
          }}
          toastOptions={{
            position: "bottom-center",
            duration: 4000,
            style: {
              padding: "14px 22px",
              borderRadius: "20px",
              fontSize: "17px",
              border: `2px solid ${ColorPalette.purple}`,
              background: "#141431e0",
              backdropFilter: "blur(6px)",
              color: ColorPalette.fontLight,
            },
            success: {
              iconTheme: {
                primary: ColorPalette.purple,
                secondary: "white",
              },
              style: {},
            },
            error: {
              iconTheme: {
                primary: "#ff3030",
                secondary: "white",
              },
              style: {
                borderColor: "#ff3030",
              },
            },
          }}
        />
        <ErrorBoundary user={user}>
          <MainLayout {...userProps}>
            <AppRouter {...userProps} />
          </MainLayout>
        </ErrorBoundary>
      </ThemeProvider>
    </>
  );
}

export default App;
