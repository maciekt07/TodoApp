import { Add, Category, GetApp, Person, TaskAlt } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Box, css, styled } from "@mui/material";
import { ColorPalette, pulseAnimation, slideInBottom } from "../styles";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";
import { User } from "../types/user";

interface BottomNavProps {
  user: User;
}

/**
 * Component for rendering the bottom navigation bar.
 */
export const BottomNav = ({ user }: BottomNavProps): JSX.Element | null => {
  const isMobile = useResponsiveDisplay();
  const location = useLocation();
  const [value, setValue] = useState<number | undefined>();
  const n = useNavigate();

  const smallIconSize = "28px";

  // useEffect hook to set the active button based on the current route
  useEffect(() => {
    const pathParts = location.pathname.split("/"); // Split the pathname by '/'
    if (pathParts[1] === "task") {
      setValue(0); // If the user is on a task page, set the value to 0
    } else {
      // Handle other routes as before
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
          setValue(undefined); // Fallback for the undefined route
      }
    }
  }, [location.pathname]);

  // If it's a mobile device, don't render the navigation bar.
  if (!isMobile) {
    return null;
  }

  return (
    <Container>
      <StyledBottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          setValue(newValue);
          event.preventDefault();
        }}
      >
        <NavigationButton
          onClick={() => n("/")}
          label="Tasks"
          icon={<TaskAlt sx={{ fontSize: smallIconSize }} />}
        />
        <NavigationButton
          onClick={() => n("/categories")}
          label="Categories"
          icon={<Category sx={{ fontSize: smallIconSize }} />}
          disabled={!user.settings[0].enableCategories}
        />
        <NavigationButton
          onClick={() => n("add")}
          showLabel={false}
          icon={
            <AddIcon
              fontSize="large"
              animate={user.tasks.length === 0 && value !== 2 ? true : undefined}
            />
          }
        />
        <NavigationButton
          onClick={() => n("import-export")}
          label="Import/Export"
          icon={<GetApp sx={{ fontSize: smallIconSize }} />}
        />
        <NavigationButton
          onClick={() => n("user")}
          label="Profile"
          icon={<Person sx={{ fontSize: smallIconSize }} />}
        />
      </StyledBottomNavigation>
    </Container>
  );
};

const AddIcon = styled(Add)<{ animate?: boolean }>`
  border: 2px solid ${ColorPalette.purple};
  background-color: #232e58;
  font-size: 38px;
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
  z-index: 999; /*9999*/
`;

const StyledBottomNavigation = styled(BottomNavigation)`
  border-radius: 18px 18px 0 0;
  background: #232e58e1;
  backdrop-filter: blur(18px);
  margin: 0px 20px 0px -20px;
  padding: 16px 10px 30px 10px;
`;

const NavigationButton = styled(BottomNavigationAction)`
  border-radius: 18px;
  margin: 4px;
  color: white;

  &:disabled {
    opacity: 0.6;
  }
  & .MuiBottomNavigationAction-label {
    font-size: 13px;
    text-shadow: 0 0 12px #000000ce;
  }
  & .Mui-selected {
    /* text-shadow: 0 0 5px ${ColorPalette.purple}; */
  }
`;
