import styled from "@emotion/styled";
import { Alarm, RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import { Button, Checkbox, IconButton, TextField, css } from "@mui/material";
import { fadeIn, ring, scale } from "../../styles/keyframes.styled";
import { ColorPalette } from "../../theme/themeConfig";
import { getFontColor, isDark, systemInfo } from "../../utils";

interface TaskComponentProps {
  backgroundColor: string;
  done: boolean;
  glow?: boolean;
  blur?: boolean;
}

export const TaskContainer = styled.div<TaskComponentProps>`
  display: flex;
  align-items: center;
  padding: 16px 16px 16px 20px;
  border-radius: 30px;
  margin-top: 14px;
  transition: 0.3s all !important;
  color: ${({ backgroundColor }) => getFontColor(backgroundColor)};
  background-color: ${({ backgroundColor, done }) => `${backgroundColor}${done ? "cc" : ""}`};
  opacity: ${({ done }) => (done ? 0.8 : 1)};
  border-left: ${({ done }) => (done ? "8px solid #00ff1ee3" : "1px solid transparent")};
  box-shadow: ${(props) =>
    props.glow && !props.blur ? `0 0 128px -20px ${props.backgroundColor}` : "none"};
  /* text-shadow: ${({ backgroundColor, glow, done }) =>
    glow && !done ? `0 0 2px ${getFontColor(backgroundColor)}78` : "none"}; */
  filter: ${({ blur }) => (blur ? "blur(2px) opacity(75%)" : "none")};

  animation: ${fadeIn} 0.5s ease-in;

  /* If the theme color and task color are the same, it changes the selection color to be different. */
  *::selection {
    background-color: ${({ theme, backgroundColor }) =>
      theme.primary === backgroundColor ? "#ffffff" : theme.primary} !important;
    color: ${({ theme, backgroundColor }) =>
      theme.primary === backgroundColor ? "#000000" : getFontColor(theme.primary)} !important;
  }

  @media (max-width: 768px) {
    padding: 14px 14px 14px 18px;
    margin-top: 12px;
  }
`;

TaskContainer.defaultProps = {
  className: "TaskContainer",
};

export const EmojiContainer = styled.span<{ clr: string }>`
  text-decoration: none;
  margin-right: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ clr }) => (clr === ColorPalette.fontDark ? "#4b4b4b6e" : "#dddddd9d")};
  font-size: 32px;
  padding: 14px;
  width: 42px;
  height: 42px;
  border-radius: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TaskInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const TaskHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const TaskName = styled.h3<{ done: boolean }>`
  font-size: 20px;
  margin: 0;
  text-decoration: ${({ done }) => (done ? "line-through" : "none")};
  word-break: break-word;
  white-space: pre-line;
`;

export const TaskDate = styled.p`
  margin: 0 6px;
  text-align: right;
  margin-left: auto;
  font-size: 14px;
  font-style: italic;
  font-weight: 300;
  backdrop-filter: none !important;
`;

export const TaskDescription = styled.div<{ done: boolean }>`
  margin: 0;
  font-size: 18px;
  text-decoration: ${({ done }) => (done ? "line-through" : "none")};
  word-break: break-word;
`;

export const ShowMoreBtn = styled(Button)<{ clr: string }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bolder;
  transition: 0.3s color;
  color: ${({ clr }) => getFontColor(clr)};
  text-shadow: ${({ clr }) => `0 0 8px ${getFontColor(clr) + 45}`};
  text-transform: capitalize;
  border-radius: 6px;
  padding: 0 4px;
  margin: 0 4px;
`;

export const NoTasks = styled.div`
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100vw;
  opacity: 0.9;
  font-size: 18px;
  & span {
    font-weight: bold;
  }
`;

export const TasksContainer = styled.main`
  display: flex;
  justify-content: center;
  max-width: 700px;
  margin: 0 auto;
  flex-direction: column;
  gap: 6px;
`;

export const TimeLeft = styled.span<{ done: boolean }>`
  text-decoration: ${({ done }) => (done ? "line-through" : "none")};
  transition: 0.3s all;
  font-size: 14px;
  margin: 4px 0;
  font-weight: 500;
  font-style: italic;
  display: flex;
  backdrop-filter: none !important;
  // fix for browser translate
  & font {
    margin: 0 1px;
  }
`;

export const Pinned = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  opacity: 0.8;
  font-size: 16px;
`;

export const SelectedTasksContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0;
  background: ${({ theme }) => (isDark(theme.secondary) ? "#090b2287" : "#ffffff5c")};
  padding: 16px 20px;
  border-radius: 18px;
  position: sticky;
  top: ${systemInfo.os === "iOS" ? "52" : "60"}px;
  z-index: 1;
  backdrop-filter: blur(24px);
  & h3 {
    margin: 0;
    display: flex;
    align-items: center;
  }
  & font {
    margin: 0 1px;
  }
`;

export const StyledRadio = styled(Checkbox)<{ clr: string }>`
  margin-left: -8px;
  margin-right: 4px;
  color: ${({ clr }) => clr} !important;
  animation: ${fadeIn} 0.3s ease-in;
  &.Mui-checked {
    color: ${({ clr }) => clr} !important;
  }
`;

const radioIconStyles = css`
  animation: ${scale} 0.2s ease-in;
  font-size: 24px;
  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

export const RadioChecked = styled(RadioButtonChecked)`
  ${radioIconStyles}
`;

export const RadioUnchecked = styled(RadioButtonUnchecked)`
  ${radioIconStyles}
`;

export const CategoriesListContainer = styled.div`
  position: sticky;
  background: transparent;
  backdrop-filter: blur(24px);
  z-index: 2;
  top: 0;
  display: flex;
  justify-content: left;
  align-items: left;
  gap: 8px;
  overflow-x: auto;
  padding: 0 0 6px 0;
  margin: 8px 0;

  /* Custom Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: ${({ theme }) => getFontColor(theme.secondary)}15;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => getFontColor(theme.secondary)}30;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => getFontColor(theme.secondary)}50;
  }

  ::-webkit-scrollbar-track {
    border-radius: 4px;
    background-color: ${({ theme }) => getFontColor(theme.secondary)}15;
  }
`;

export const HighlightedText = styled.span`
  background-color: #6829ef;
  color: #fff;
  padding: 2px 0;
  border-radius: 4px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  margin: 0;
  font-weight: bold;
  border: 1px solid #ffffff5f;
  transition: 0.3s all;
`;

export const DescriptionLink = styled(Button)<{ clr: string }>`
  margin: 0;
  color: ${({ clr }) => getFontColor(clr)};
  padding: 0 4px;
  display: inline-block;
  background: ${({ clr }) => getFontColor(clr)}28;
  backdrop-filter: none !important;
  text-transform: none !important;
  min-width: unset !important;
  user-select: auto !important;
  border-radius: 6px;
  &:hover {
    background: ${({ clr }) => getFontColor(clr)}19;
  }
  & div {
    word-break: break-all;
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

export const YouTubeThumbnail = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 6px;
  & img {
    width: 300px;
    height: 160px;
    border-radius: 12px;
    margin-bottom: 6px;
    object-fit: cover;
    object-position: 100%;
    opacity: 0.9;
  }
  @media (max-width: 768px) {
    & img {
      width: 150px;
      height: 80px;
    }
    justify-content: left;
  }
`;

export const SearchInput = styled(TextField)`
  margin: 8px 0 0 0;
  border-radius: 16px;
  transition: 0.3s all;
  width: 100%;
  & .MuiOutlinedInput-notchedOutline {
    border: 1px solid ${({ theme }) => (isDark(theme.secondary) ? "#44479cb7" : theme.primary)} !important;
  }
  & .MuiOutlinedInput-root {
    padding: 2px 16px;
    border-radius: 16px;
    transition: 0.3s all;
    background: ${({ theme }) => (isDark(theme.secondary) ? "#090b2258" : "#ffffff3e")};
    color: ${({ theme }) => getFontColor(theme.secondary)};
    & .MuiSvgIcon-root {
      color: ${({ theme }) => getFontColor(theme.secondary)};
    }
  }
`;

export const SearchClear = styled(IconButton)`
  animation: ${scale} 0.3s ease;
  transition: 0.3s all;
`;

const ringAnimation = "2s 0.5s ease-in-out infinite";

export const RingAlarm = styled(Alarm)<{ animate?: boolean }>`
  color: red;
  ${({ animate }) =>
    animate &&
    css`
      -webkit-animation: ${ring} ${ringAnimation};
      -moz-animation: ${ring} ${ringAnimation};
      animation: ${ring} ${ringAnimation};
    `}
`;
