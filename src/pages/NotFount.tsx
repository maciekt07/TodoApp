import styled from "@emotion/styled";
import { ArrowBackIosNew } from "@mui/icons-material";
import { Button } from "@mui/material";

import { useNavigate } from "react-router-dom";

export const NotFount = () => {
  const n = useNavigate();

  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      <Description>Page Not Found</Description>
      <BackButton variant="outlined" onClick={() => n("/")}>
        <ArrowBackIosNew /> &nbsp; Go back to home
      </BackButton>
    </Container>
  );
};

const Container = styled.div`
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100vw;
  line-height: 2em;
`;

const ErrorCode = styled.h1`
  font-size: 96px;
  color: #b624ff;
  text-shadow: 0 0 10px #b624ffa9;
`;

const Description = styled.p`
  font-size: 22px;
  opacity: 0.9;
`;

const BackButton = styled(Button)`
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 16px;
  margin: 16px;
`;
