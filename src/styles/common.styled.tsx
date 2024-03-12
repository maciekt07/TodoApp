import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { getFontColor } from "../utils";

export const DialogBtn = styled(Button)`
  padding: 10px 16px;
  border-radius: 16px;
  font-size: 16px;
  margin: 8px;
`;
export const StyledLink = styled.a<{ clr?: string }>`
  cursor: pointer;
  color: ${({ clr, theme }) => clr || theme.primary};
  display: inline-block;
  position: relative;
  text-decoration: none;
  font-weight: 500;
  transition: 0.3s all;
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: ${({ clr, theme }) => clr || theme.primary};
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
    border-radius: 100px;
  }
  &:hover::after,
  &:focus-visible::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
  &:hover {
    text-shadow: 0px 0px 20px ${({ clr, theme }) => clr || theme.primary};
  }
  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
`;
// Styled button for color selection
export const ColorElement = styled.button<{ clr: string; secondClr?: string; size?: string }>`
  background: ${({ clr, secondClr }) =>
    secondClr ? `linear-gradient(135deg, ${clr} 50%, ${secondClr} 50%)` : clr};

  color: ${({ clr }) => getFontColor(clr || "")};
  border: none;
  cursor: pointer;
  width: ${({ size }) => size || "48px"};
  height: ${({ size }) => size || "48px"};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  transition: 0.2s all;
  transform: scale(1);

  &:focus-visible {
    outline: 4px solid ${({ theme }) => theme.primary};
  }
  &:hover {
    /* transform: scale(1.05); */
    box-shadow: 0 0 12px ${({ clr }) => clr};
    /* outline: none; */
  }
`;

export const PathName = styled.code`
  background: #000000c8;
  color: white;
  font-family: consolas !important;
  padding: 4px 6px;
  border-radius: 8px;
`;
