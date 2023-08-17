import { Add, Category, GetApp, Person, TaskAlt } from "@mui/icons-material";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  css,
  styled,
} from "@mui/material";
import { ColorPalette, pulseAnimation, slideInBottom } from "../styles";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";
import { User } from "../types/user";

export const BottomNav = ({ user }: { user: User }) => {
  const isMobile = useResponsiveDisplay();
  const location = useLocation();
  const [value, setValue] = useState<number | undefined>();
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
      case "/":
        setValue(0);
        break;
      default:
        setValue(undefined); // Fallback for the "Tasks" route
    }
  }, [location.pathname]);

  if (!isMobile) {
    return null;
  }

  return (
    <Container>
      <StyledBottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          event.preventDefault();
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
          disabled={!user.settings[0].enableCategories}
        />
        <NavigationButton
          onClick={() => n("add")}
          showLabel={false}
          label="Add New"
          icon={
            <AddIcon
              fontSize="large"
              animate={
                user.tasks.length === 0 && value !== 2 ? true : undefined
              }
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
    </Container>
  );
};

const AddIcon = styled(Add)<{ animate?: boolean }>`
  border: 2px solid ${ColorPalette.purple};
  background-color: #232e58;

  border-radius: 100px;
  padding: 6px;
  ${({ animate }) =>
    animate &&
    css`
      animation: ${pulseAnimation} 1.2s infinite;
    `}
`;

const Container = styled(Box)`
  position: fixed;
  bottom: 0;
  width: 100%;
  margin: 0;
  animation: ${slideInBottom} 0.5s ease;
`;

const StyledBottomNavigation = styled(BottomNavigation)`
  border-radius: 30px 30px 0 0;
  background: #232e58;
  margin: 0px 20px 0px -20px;
  padding: 14px 10px;
`;

const NavigationButton = styled(BottomNavigationAction)`
  border-radius: 18px;
  margin: 4px;
  color: white;
  &:disabled {
    opacity: 0.6;
  }
`;
