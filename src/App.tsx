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
  useEffect(() => {
    if (user.categories === undefined) {
      setUser({ ...user, categories: defaultUser.categories });
    }
  }, []);
  return (
    <>
      <ThemeProvider theme={MuiTheme}>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={<Home user={user} setUser={setUser} />} />
          <Route
            path="/add"
            element={<AddTask user={user} setUser={setUser} />}
          />
          <Route
            path="/user"
            element={<UserSettings user={user} setUser={setUser} />}
          />
          <Route
            path="/categories"
            element={<Categories user={user} setUser={setUser} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
