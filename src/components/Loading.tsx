import styled from "@emotion/styled";
import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

export const Loading = () => {
  const [showLoading, setShowLoading] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(true);
    }, 100); // Show the loading spinner after 100 milliseconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container>
      {showLoading && <CircularProgress size={80} thickness={4} aria-label="loading" />}
    </Container>
  );
};

const Container = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  gap: 8px;
`;
