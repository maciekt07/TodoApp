import styled from "@emotion/styled";
import { getFontColor } from "../utils";
import { fadeIn, scale } from "./keyframes.styled";
import { Accordion, Button, css, TextField } from "@mui/material";
import { StarOutlineRounded, StarRounded } from "@mui/icons-material";
import { reduceMotion } from ".";

export const CategoriesContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 40px;
`;

export const CategoryElementsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 350px;
  background: ${({ theme }) => (theme.darkmode ? "#0000005a" : "#acacac5a")};
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px 18px;
  border-radius: 18px;
`;

export const AddContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 4px;
`;

export const CategoryElement = styled.div<{ clr: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 400px;
  width: 400px;
  margin: 6px 0;
  padding: 12px;
  border-radius: 18px;
  background: ${({ clr }) => clr};
  color: ${({ clr }) => getFontColor(clr)};
  animation: ${fadeIn} 0.5s ease-in-out;
  @media (max-width: 768px) {
    width: 360px;
  }

  ${({ theme }) => reduceMotion(theme)}
`;

export const CategoryContent = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  margin: 0 4px;
  gap: 4px;
`;

export const ActionButton = styled.div`
  /* background: #ffffffcd; */
  background: ${({ theme }) => (theme.darkmode ? "#000000cd" : "#ffffffcd")};
  border-radius: 100%;
`;
export const CategoryInput = styled(TextField)`
  margin: 12px;

  .MuiOutlinedInput-root {
    border-radius: 16px;
    width: 400px;
    color: ${({ theme }) => getFontColor(theme.secondary)};
  }
  & .MuiFormHelperText-root {
    color: ${({ theme }) => getFontColor(theme.secondary)};
    opacity: 0.8;
  }
`;

export const EditNameInput = styled(TextField)`
  margin-top: 8px;
  .MuiOutlinedInput-root {
    border-radius: 16px;
    width: 350px;
  }
`;

export const AddCategoryButton = styled(Button)`
  border: none;
  padding: 18px 48px;
  font-size: 24px;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => getFontColor(theme.primary)};
  border-radius: 999px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s all;
  margin: 20px;
  width: 400px;
  text-transform: capitalize;
  &:hover {
    box-shadow: 0px 0px 24px 0px ${({ theme }) => theme.primary + "80"};
    background: ${({ theme }) => theme.primary};
  }
  &:disabled {
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0.7;
    color: white;
  }
`;

export const AssociatedTasksAccordion = styled(Accordion)`
  margin: 16px 0;
  background: transparent;
  box-shadow: none;
  border: 2px solid ${({ theme }) => `${theme.darkmode ? "#ffffff" : "#000000"}5a`};
  border-radius: 12px !important;
`;

const StarIconStyles = css`
  animation: ${scale} 0.2s ease-in;
`;

export const StarChecked = styled(StarRounded)`
  ${StarIconStyles}
  ${({ theme }) => reduceMotion(theme)}
`;

export const StarUnchecked = styled(StarOutlineRounded)`
  ${StarIconStyles}
  ${({ theme }) => reduceMotion(theme)}
`;
