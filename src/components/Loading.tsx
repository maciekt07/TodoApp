import React from 'react';
import styled from "@emotion/styled";
import { CircularProgress } from '@mui/material';

interface LoadingProps {
  size?: number;
  thickness?: number;
}

export const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const Loading: React.FC<LoadingProps> = ({ size = 80, thickness = 4 }) => {
  return (
    <Wrapper>
      <CircularProgress size={size} thickness={thickness} />
    </Wrapper>
  );
};

export default Loading;
