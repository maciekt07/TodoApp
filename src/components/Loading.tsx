import React from 'react';
import { CircularProgress, Box } from '@mui/material';

interface LoadingProps {
  size?: number;
  thickness?: number;
}

const Loading: React.FC<LoadingProps> = ({ size = 80, thickness = 4 }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress size={size} thickness={thickness} />
    </Box>
  );
};

export default Loading;
