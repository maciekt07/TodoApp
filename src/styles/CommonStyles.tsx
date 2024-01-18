import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button } from "@mui/material";

export const ScrollBarLight = css`
  /* Custom Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 8px;
    border-radius: 4px;
    background-color: #84848415;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #8484844b;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #84848476;
  }

  ::-webkit-scrollbar-track {
    border-radius: 4px;
    background-color: #84848415;
  }
`;
export const DialogBtn = styled(Button)`
  padding: 10px 16px;
  border-radius: 16px;
  font-size: 16px;
  margin: 8px;
`;
