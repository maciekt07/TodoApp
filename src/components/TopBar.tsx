import styled from "@emotion/styled";
import { ArrowBackIosNew } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ColorPalette } from "../styles";

interface TopBarProps {
  title: string;
}

export const TopBar = ({ title }: TopBarProps) => {
  const n = useNavigate();
  const handleBackClick = () => n("/");
  return (
    <Container>
      <BackBtn onClick={handleBackClick}>
        <ArrowBackIosNew /> &nbsp; Back
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
  backdrop-filter: blur(8px);
  margin-bottom: 48px;
`;

const Title = styled.h2`
  font-size: 28px;
  margin: 0 auto;
  text-align: center;
  padding: 4px 0 8px 0;
  text-shadow: 0 0 24px #00000068;
`;
const BackBtn = styled.button`
  position: absolute;

  /* top: 24px;
  left: 16px; */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  padding: 8px 12px;
  background-color: transparent;
  color: ${ColorPalette.fontLight};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s all;

  text-shadow: 0 0 24px #00000068;
  &:hover {
    opacity: 0.8;
  }
`;
