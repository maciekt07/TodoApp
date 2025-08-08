import styled from "@emotion/styled";
import {
  Button,
  ListSubheader,
  MenuItem,
  Select,
  SelectProps,
  Stack,
  Tab,
  TabProps,
  Typography,
} from "@mui/material";
import { useResponsiveDisplay } from "../../hooks/useResponsiveDisplay";
import { TabPanel } from "../TabPanel";
import { fadeIn, reduceMotion } from "../../styles";

const UnstyledSelect = (props: SelectProps) => {
  const isMobile = useResponsiveDisplay();
  return (
    <Select
      fullWidth
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: isMobile ? 400 : 220,
            overflowY: "auto", // Make the dropdown scrollable if the content exceeds the height
          },
        },
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "left",
        },
      }}
      {...props}
    />
  );
};

export const StyledTabPanel = styled(TabPanel)`
  animation: ${fadeIn} 0.3s ease-in;
  ${({ theme }) => reduceMotion(theme)}
`;

export const StyledSelect = styled(UnstyledSelect)`
  margin: 8px 0;
`;

export const TabHeading = styled(Typography)`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
`;

export const SectionHeading = styled(Typography)`
  font-size: 16px;
  font-weight: 500;
  margin-top: 16px;
  margin-bottom: 4px;
`;

export const SectionDescription = styled(Typography)`
  font-size: 14px;
  line-height: 1.5;
  opacity: 0.7;
  margin-bottom: 8px;
`;

export const UnstyledTab = (props: TabProps) => {
  const isMobile = useResponsiveDisplay();
  return <Tab iconPosition={isMobile ? "top" : "start"} {...props} />;
};

export const StyledTab = styled(UnstyledTab)`
  justify-content: flex-start;
  margin-right: 12px;
  border-radius: 14px;
  min-height: 0;
  padding: 18px;
  &.Mui-selected {
    background-color: ${({ theme }) => theme.primary + "23"};
  }
  @media (max-width: 768px) {
    margin-right: 0;
    font-size: 13px;
    min-height: 0;
    padding: 10px 6px;
    margin: 0 8px;
    border-radius: 14px;
  }
`;

export const StyledMenuItem = styled(MenuItem)`
  padding: 12px 20px;
  border-radius: 12px;
  margin: 0 8px;
  display: flex;
  gap: 6px;
`;

export const NoVoiceStyles = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 6px;
  opacity: 0.8;
  font-weight: 500;
  max-width: 330px;
  margin: 0 auto;
`;

export const VolumeSlider = styled(Stack)`
  margin: 8px 0;
  background: #afafaf2b;
  padding: 12px 24px 12px 18px;
  border-radius: 18px;
  transition: 0.3s all;
  width: 100%;
`;

export const StyledListSubheader = styled(ListSubheader)`
  background-color: ${({ theme }) => (theme.darkmode ? "#2e2e2e" : "#ffffff")};
  font-weight: 600;
  position: sticky;
  z-index: 1;
  top: 0;
`;

export const CloseButtonContainer = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
`;

export const CloseButton = styled(Button)`
  padding: 16px 64px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 999px;
`;
