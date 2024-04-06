import styled from "@emotion/styled";
import { ArrowBackIosNewRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getFontColor } from "../utils";
import { IconButton } from "@mui/material";

interface TopBarProps {
  title: string;
}

/**
 * Component for displaying a top bar with a title and a back button.
 * @param {string} title - Title of page
 */
export const TopBar = ({ title }: TopBarProps) => {
  const n = useNavigate();
  return (
    <Container>
      <BackBtn size="large" onClick={() => n("/")}>
        <ArrowIcon />
      </BackBtn>
      <Title>{title}</Title>
    </Container>
  );
};

const Container = styled.div`
  margin: 0;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 99;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background-color: ${({ theme }) => theme.secondary + "c1"};
  margin-bottom: 48px;
`;

const ArrowIcon = styled(ArrowBackIosNewRounded)`
  color: ${({ theme }) => getFontColor(theme.secondary)};
`;

const Title = styled.h2`
  font-size: 28px;
  margin: 0 auto;
  text-align: center;
  padding: 4px 0 8px 0;
  text-shadow: 0 0 24px #00000068;
`;
const BackBtn = styled(IconButton)`
  position: absolute;
  color: ${({ theme }) => getFontColor(theme.secondary)};
  @media (max-width: 1024px) {
    margin-top: 4px;
  }
`;
