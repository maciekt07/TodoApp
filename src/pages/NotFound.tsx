import styled from "@emotion/styled";
import { ArrowBackIosNew } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ColorPalette } from "../styles";
import { useEffect } from "react";
import TaskNotFound from "../assets/TaskNotFound.png";

export const NotFound = () => {
  const n = useNavigate();

  useEffect(() => {
    document.title = "Todo App - Page Not Found";
  }, []);

  return (
    <Container>
      <ErrorCode>404</ErrorCode>

      <NotFoundImg src={TaskNotFound} />
      <Description>
        Page{" "}
        <PathName>
          {location.pathname.length > 32
            ? location.pathname.substring(0, 29) + "..."
            : location.pathname}
        </PathName>{" "}
        was not found.
      </Description>
      <BackButton variant="outlined" onClick={() => n("/")}>
        <ArrowBackIosNew /> &nbsp; Go back to tasks
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
  font-size: 128px;
  color: ${ColorPalette.purple};
  text-shadow: 0 0 32px #b624ffa9;
`;

const Description = styled.p`
  font-size: 22px;
  opacity: 0.9;
  line-height: 1.8em;
  margin: 32px;
`;

const BackButton = styled(Button)`
  padding: 12px 20px;
  font-size: 18px;
  border-radius: 16px;
  margin: 16px;
`;

const NotFoundImg = styled.img`
  width: 350px;
  margin-left: 32px;
  filter: drop-shadow(0px 0px 128px ${ColorPalette.purple});
`;

const PathName = styled.code`
  background: black;
  font-family: consolas !important;
  padding: 4px 6px;
  border-radius: 8px;
`;
