import styled from "@emotion/styled";
import { getFontColor } from "../utils";
import { fadeIn } from "./keyframes.styled";
import { Button, TextField } from "@mui/material";

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
  background: ${({ theme }) => getFontColor(theme.secondary)}1a;
  overflow-y: auto;
  padding: 24px 18px;
  border-radius: 18px 0 0 18px;
  /* Custom Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 8px;
    border-radius: 4px;
    background-color: ${({ theme }) => getFontColor(theme.secondary) + "15"};
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => getFontColor(theme.secondary) + "30"};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => getFontColor(theme.secondary) + "50"};
  }

  ::-webkit-scrollbar-track {
    border-radius: 4px;
    background-color: ${({ theme }) => getFontColor(theme.secondary) + "15"};
  }
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
  width: 350px;
  margin: 6px 0;
  padding: 12px;
  border-radius: 18px;
  background: ${({ clr }) => clr};
  color: ${({ clr }) => getFontColor(clr)};
  animation: ${fadeIn} 0.5s ease-in-out;
`;

export const CategoryContent = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  margin: 0 4px;
  gap: 4px;
`;

export const ActionButton = styled.div`
  background: #ffffffcd;
  border-radius: 100%;
  margin: 0 4px;
`;
export const CategoryInput = styled(TextField)`
  margin: 12px;

  .MuiOutlinedInput-root {
    border-radius: 16px;
    width: 350px;
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
    width: 300px;
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
  width: 350px;
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
