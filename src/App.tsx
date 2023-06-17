import { useStorageState } from "./hooks/useStorageState";
import { Route, Routes } from "react-router-dom";
import { defaultUser } from "./constants/defaultUser";
import { User } from "./types/user";
import { Home } from "./pages/Home";
import { AddTask } from "./pages/AddTask";
import { GlobalStyles, MuiTheme } from "./styles";
import { UserSettings } from "./pages/UserSettings";
import { ThemeProvider } from "@mui/material";
import { NotFound } from "./pages/NotFound";
import { useEffect } from "react";
import { Categories } from "./pages/Categories";

function App() {
  const [user, setUser] = useStorageState<User>(defaultUser, "user");
  // Initialize user properties if they are undefined
  useEffect(() => {
    if (user.categories === undefined) {
      setUser({ ...user, categories: defaultUser.categories });
    }
    if (
      user.settings === undefined ||
      user.settings[0].enableCategories === undefined
    ) {
      setUser({ ...user, settings: defaultUser.settings });
    }
  }, []);
  const userProps = { user, setUser };
  return (
    <>
      <ThemeProvider theme={MuiTheme}>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={<Home {...userProps} />} />
          <Route path="/add" element={<AddTask {...userProps} />} />
          <Route path="/user" element={<UserSettings {...userProps} />} />
          <Route path="/categories" element={<Categories {...userProps} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
