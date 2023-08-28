import { useStorageState } from "./hooks/useStorageState";
import { defaultUser } from "./constants/defaultUser";
import { User } from "./types/user";
import { GlobalStyles, MuiTheme } from "./styles";
import { ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { ErrorBoundary } from "./components";
import { MainLayout } from "./layouts/MainLayout";
import { AppRouter } from "./router";

function App() {
  const [user, setUser] = useStorageState<User>(defaultUser, "user");
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
