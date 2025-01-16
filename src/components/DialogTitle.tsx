import styled from "@emotion/styled";
import { CloseRounded } from "@mui/icons-material";
import { DialogTitle, Divider, IconButton } from "@mui/material";
import { ComponentProps, JSX } from "react";

type MuiDialogTitleProps = ComponentProps<typeof DialogTitle>;

interface CustomDialogTitleProps extends MuiDialogTitleProps {
  title: string;
  subTitle?: string;
  icon?: JSX.Element;
  removeDivider?: boolean;
  onClose?: () => void;
}

export const CustomDialogTitle = ({
  title,
  subTitle,
  icon,
  removeDivider,
  onClose,
  ...props
}: CustomDialogTitleProps) => {
  return (
    <DialogTitle {...props}>
      {onClose && (
        <CloseButton onClick={onClose} size="small">
          <CloseRounded />
        </CloseButton>
      )}
      <TitleContainer>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        <TextContainer>
          <Title>{title}</Title>
          {subTitle && <SubTitle>{subTitle}</SubTitle>}
        </TextContainer>
      </TitleContainer>
      {!removeDivider && <StyledDivider />}
    </DialogTitle>
  );
};

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  max-width: 400px;
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  right: 24px;
  top: 24px;
  z-index: 1;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => (theme.darkmode ? "#5c5c5c" : "#E5E5E8")};
  box-shadow: 0px 0px 1px ${({ theme }) => (theme.darkmode ? "#5c5c5c" : "#E5E5E8")};
  color: ${({ theme }) => (theme.darkmode ? "#c2c2c2" : "#696969")};
  width: 24px;
  height: 24px;
  padding: 12px;
  border-radius: 16px;
`;
const TextContainer = styled.div`
  line-height: 1.3em;
`;
const Title = styled.div`
  font-weight: 600;
  opacity: 0.9;
`;

const SubTitle = styled.div`
  font-size: 14px;
  opacity: 0.7;
`;

const StyledDivider = styled(Divider)`
  margin-top: 16px;
`;
