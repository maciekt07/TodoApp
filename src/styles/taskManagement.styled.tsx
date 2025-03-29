import styled from "@emotion/styled";
import { Box, Button, ButtonProps } from "@mui/material";
import { getFontColor } from "../utils";
import { Info } from "@mui/icons-material";

//TODO: design this better
export const TaskManagementContainer = styled(Box)<{ backgroundClr: string; selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: left;
  margin: 8px;
  padding: 10px 4px;
  border-radius: 16px;
  background: ${({ theme }) => (theme.darkmode ? "#00000030" : "#ffffff30")};
  border: 2px solid ${({ backgroundClr }) => backgroundClr};
  box-shadow: ${({ selected, backgroundClr }) => selected && `0 0 8px 1px ${backgroundClr}`};
  transition: 0.3s all;
  width: 300px;
  cursor: "pointer";
  & span {
    font-weight: ${({ selected }) => (selected ? 600 : 500)}!important;
  }
`;

export const ManagementHeader = styled.h2`
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ListContent = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 6px;
`;

export const DropZone = styled.div<{ isDragging: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 6px;
  border: 2px dashed ${({ theme }) => theme.primary};
  border-radius: 16px;
  padding: 32px 64px;
  text-align: center;
  max-width: 300px;
  box-shadow: ${({ isDragging, theme }) => isDragging && `0 0 32px -2px ${theme.primary}`};
  transition: 0.3s all;
  & div {
    font-weight: 500;
  }
`;

export const InfoIcon = styled(Info)`
  color: ${({ theme }) => getFontColor(theme.secondary)};
`;

export const ManagementContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  max-height: 350px;
  overflow-y: auto;

  /* Custom Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 8px;
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

export const ManagementButtonsContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 24px;
`;

const UnstyledManagementButton = ({ ...props }: ButtonProps) => (
  <Button variant="outlined" {...props} />
);

export const ManagementButton = styled(UnstyledManagementButton)`
  padding: 12px 18px;
  border-radius: 14px;
  width: 300px;

  &:disabled {
    color: ${({ theme }) => getFontColor(theme.secondary) + "82"};
    border-color: ${({ theme }) => getFontColor(theme.secondary) + "82"};
  }
`;
