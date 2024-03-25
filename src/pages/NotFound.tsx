import styled from "@emotion/styled";
import { ArrowBackIosNew } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PathName } from "../styles";
import { ReactNode, useEffect } from "react";
import { TaskIcon } from "../components";

interface NotFoundProps {
  message?: string | ReactNode;
}

const NotFound: React.FC<NotFoundProps> = ({ message }) => {
  const n = useNavigate();

  useEffect(() => {
    document.title = "Todo App - Page Not Found";
  }, []);

  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      <TaskIcon scale={0.9} />
      <Description>
        {message || (
          <div>
            Page{" "}
            <PathName>
              {location.pathname.length > 32
                ? location.pathname.substring(0, 29) + "..."
                : location.pathname}
            </PathName>{" "}
            was not found.
          </div>
        )}
      </Description>
      <BackButton variant="outlined" onClick={() => n("/")}>
        <ArrowBackIosNew /> &nbsp; Go back to tasks
      </BackButton>
    </Container>
  );
};
export default NotFound;

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
  color: ${({ theme }) => theme.primary};
  text-shadow: 0 0 32px ${({ theme }) => theme.primary + "a9"};
  margin: 48px 0;
`;

const Description = styled.p`
  font-size: 22px;
  line-height: 1.8em;
  margin: 32px;
`;

const BackButton = styled(Button)`
  padding: 12px 20px;
  font-size: 18px;
  border-radius: 16px;
  margin: 16px;
`;
