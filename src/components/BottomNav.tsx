import {
  AddRounded,
  CategoryRounded,
  GetAppRounded,
  PersonRounded,
  TaskAlt,
} from "@mui/icons-material";
import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  css,
  styled,
  useTheme,
} from "@mui/material";
import { JSX, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";
import { pulseAnimation, slideInBottom } from "../styles";
import { getFontColor } from "../utils";

/**
 * Component for rendering the bottom navigation bar.
 */
export const BottomNav = (): JSX.Element | null => {
  const { user } = useContext(UserContext);
  const { tasks, settings } = user;
  const [value, setValue] = useState<number | undefined>();

  const theme = useTheme();
  const n = useNavigate();
  const isMobile = useResponsiveDisplay();
  const location = useLocation();

  const smallIconSize = "29px";

  // useEffect hook to set the active button based on the current route
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    if (pathParts[1] === "task") {
      setValue(0);
    } else {
      switch (location.pathname) {
        case "/categories":
          setValue(1);
          break;
        case "/add":
          setValue(2);
          break;
        case "/transfer":
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

  if (!isMobile) {
    return null;
  }

  return (
    <Container>
      <StyledBottomNavigation
        showLabels
        glow={settings.enableGlow}
        value={value}
        onChange={(_event, newValue: number) => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          setValue(newValue);
        }}
      >
        <NavigationButton
          onClick={() => n("/")}
          label="Tasks"
          icon={
            <Badge
              color="primary"
              badgeContent={value !== 0 ? tasks.filter((task) => !task.done).length : undefined}
              max={99}
            >
              <TaskAlt sx={{ fontSize: smallIconSize }} />
            </Badge>
          }
        />
        <NavigationButton
          onClick={() => n("/categories")}
          label="Categories"
          icon={<CategoryRounded sx={{ fontSize: smallIconSize }} />}
          disabled={!settings.enableCategories}
        />

        <NavigationButton
          onClick={() => n("add")}
          showLabel={false}
          aria-label="Add"
          icon={
            <AddIconContainer
              clr={theme.palette.primary.main}
              animate={tasks.length === 0 && value !== 2}
            >
              <AddIcon clr={theme.palette.primary.main} fontSize="large" />
            </AddIconContainer>
          }
        />
        <NavigationButton
          onClick={() => n("transfer")}
          label="Transfer"
          icon={<GetAppRounded sx={{ fontSize: smallIconSize }} />}
        />
        <NavigationButton
          onClick={() => n("user")}
          label="Profile"
          icon={<PersonRounded sx={{ fontSize: smallIconSize }} />}
        />
      </StyledBottomNavigation>
    </Container>
  );
};

const AddIconContainer = styled(Box)<{ clr: string; animate: boolean }>`
  border-radius: 100px;
  padding: 0;
  margin: 0 !important;

  display: flex;
  align-items: center;
  justify-content: center;
  ${({ animate, theme }) =>
    animate &&
    css`
      animation: ${pulseAnimation(theme.palette.primary.main, 10)} 1.2s infinite;
    `};
`;

const AddIcon = styled(AddRounded)<{ clr: string }>`
  border: 2px solid ${({ clr }) => clr};
  background-color: ${({ theme }) => theme.palette.secondary.main};
  font-size: 38px;
  border-radius: 100px;
  padding: 6px;
  margin: 0 !important;
  transition: background 0.3s;
`;

const Container = styled(Box)`
  position: fixed;
  bottom: 0;
  width: 100%;
  margin: 0;
  animation: ${slideInBottom} 0.5s ease;
  z-index: 999;
`;

const StyledBottomNavigation = styled(BottomNavigation)<{ glow: boolean }>`
  /* border-radius: 24px 24px 0 0; */
  background: ${({ theme, glow }) => `${theme.palette.secondary.main}${glow ? "c8" : "e6"}`};
  backdrop-filter: blur(20px);
  margin: 0px 20px 0px -20px;
  padding: 18px 10px 32px 10px;
  transition:
    0.3s background,
    color;
  @media print {
    display: none;
  }
`;

const NavigationButton = styled(BottomNavigationAction)`
  border-radius: 18px;
  margin: 4px;
  color: ${({ theme }) => getFontColor(theme.palette.secondary.main)};

  &:disabled {
    opacity: 0.6;
    & .MuiBottomNavigationAction-label {
      text-shadow: none;
    }
  }

  & .MuiBottomNavigationAction-label {
    font-size: 13px !important;
  }
`;
