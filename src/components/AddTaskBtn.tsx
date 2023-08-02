import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ColorPalette, pulseAnimation } from "../styles";
import { Tooltip } from "@mui/material";
import { User } from "../types/user";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";

interface Props {
  animate: boolean;
  user: User;
}

export const AddTaskBtn = ({ animate, user }: Props) => {
  const n = useNavigate();
  const isMobile = useResponsiveDisplay();

  if (isMobile) {
    return null;
  }

  return (
    <Tooltip
      title={user.tasks.length > 0 ? "Add New Task" : "Add Task"}
      placement="left"
    >
      <Btn
        animate={animate}
        glow={user.settings[0].enableGlow}
        onClick={() => n("add")}
        aria-label="Add Task"
      >
        <Add style={{ fontSize: "38px" }} />
      </Btn>
    </Tooltip>
  );
};

const Btn = styled.button<{ animate: boolean; glow: boolean }>`
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 24px;
  width: 72px;
  height: 72px;
  border-radius: 100%;
  background-color: ${ColorPalette.purple};
  color: white;
  right: 16vw;
  box-shadow: ${(props) =>
    props.glow ? `0px 0px 20px 0px ${ColorPalette.purple}` : "none"};
  transition: background-color 0.3s, backdrop-filter 0.3s, box-shadow 0.3s;

  &:hover {
    box-shadow: none;
    background-color: #b624ffd0;
    backdrop-filter: blur(6px);
  }

  ${({ animate }) =>
    animate &&
    css`
      animation: ${pulseAnimation} 1.2s infinite;
    `}

  @media (max-width: 1024px) {
    right: 24px;
  }
`;
