import { Add, Category, GetApp, Person, TaskAlt } from "@mui/icons-material";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  styled,
} from "@mui/material";
import { ColorPalette } from "../styles";
import { SyntheticEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";

export const BottomNav = () => {
  const isMobile = useResponsiveDisplay();
  const location = useLocation();
  const [value, setValue] = useState<number | SyntheticEvent<Element>>(0);
  const n = useNavigate();

  // useEffect hook to set the active button based on the current route
  useEffect(() => {
    switch (location.pathname) {
      case "/categories":
        setValue(1);
        break;
      case "/add":
        setValue(2);
        break;
      case "/import-export":
        setValue(3);
        break;
      case "/user":
        setValue(4);
        break;
      default:
        setValue(0); // Fallback for the "Tasks" route
    }
  }, [location.pathname]);
  if (!isMobile) {
    return null;
  }

  return (
    <Box sx={{ position: "fixed", bottom: 0, width: "100%", m: 0 }}>
      <StyledBottomNavigation
        showLabels
        value={value}
        onChange={(newValue) => {
          setValue(newValue); // Cast newValue to number since it is inferred as SyntheticEvent by default
        }}
      >
        <NavigationButton
          onClick={() => n("/")}
          label="Tasks"
          icon={<TaskAlt />}
        />
        <NavigationButton
          onClick={() => n("/categories")}
          label="Categories"
          icon={<Category />}
        />
        <NavigationButton
          onClick={() => n("add")}
          showLabel={false}
          label="Add New"
          icon={
            <Add
              fontSize="large"
              sx={{
                border: `2px solid ${ColorPalette.purple}`,
                borderRadius: "100px",
                padding: "6px",
              }}
            />
          }
        />
        <NavigationButton
          onClick={() => n("import-export")}
          label="Import/Export"
          icon={<GetApp />}
        />
        <NavigationButton
          onClick={() => n("user")}
          label="Profile"
          icon={<Person />}
        />
      </StyledBottomNavigation>
    </Box>
  );
};

const StyledBottomNavigation = styled(BottomNavigation)`
  border-radius: 32px 32px 0 0;
  background: #232e58;
  margin: 0px 20px 0px -20px;
  padding: 14px 10px;
`;

const NavigationButton = styled(BottomNavigationAction)`
  border-radius: 18px;
  color: white;
`;
