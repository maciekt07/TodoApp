import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { ColorPalette } from ".";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const Input = styled.input`
  font-size: 24px;
  border: none;
  width: 400px;
  padding: 16px;
  border-radius: 20px;
  background-color: #ffffffd8;
  border: 4px solid #7614ff;
  color: #212121;
  &::placeholder {
    color: #212121;
  }
`;

export const EmojiPreview = styled.div`
  background: #ffffffd8;
  display: flex;
  border-radius: 18px;
  padding: 18px;
  font-size: 24px;
`;
export const ColorPreview = styled.div<{ color: string }>`
  padding: 32px;
  border-radius: 18px;
  border: 2px solid white;
  background-color: ${(props) => props.color};
`;
export const CloseEmojiBtn = styled.button`
  border: none;
  background: red;
  color: white;
  position: absolute;
  bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
`;

export const OpenPickerBtn = styled.button`
  border: none;
  background: #4242ff;
  border-radius: 10px;
  color: white;
  padding: 8px 12px;
  cursor: pointer;
`;

export const AddTaskButton = styled(Button)`
  border: none;
  padding: 18px 48px;
  font-size: 24px;
  background: ${ColorPalette.purple};
  color: #ffffff;
  border-radius: 26px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s all;
  margin: 20px;
  width: 400px;
  text-transform: capitalize;
  &:hover {
    box-shadow: 0px 0px 24px 0px #7614ff;
    background: ${ColorPalette.purple};
  }
  &:disabled {
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0.7;
    color: white;
  }
`;

// export const ColorPicker = styled.input`
//   width: 64px;
//   height: 64px;
//   border: none;
//   background: #ffffffd8;
//   -webkit-appearance: none;
//   -moz-appearance: none;
//   appearance: none;
//   border-radius: 12px;

//   cursor: pointer;
//   &::-webkit-color-swatch {
//     border-radius: 20px;
//     border: none;
//   }
// `;
