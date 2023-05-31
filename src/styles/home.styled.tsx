import styled from "@emotion/styled";
import { fadeIn, fadeInLeft } from "./globalStyles";

export const GreetingHeader = styled.div`
  display: flex;
  margin-top: 12px;
  font-size: 26px;
  font-weight: bold;
  margin-top: 16px;
  margin-left: 8px;

  @media (max-width: 600px) {
    font-size: 24px;
  }
`;

export const GreetingText = styled.div`
  font-size: 16px;
  margin-top: 2px;
  margin-left: 8px;
  font-style: italic;
  animation: ${fadeInLeft} 0.5s ease-in-out;
`;

export const TasksCountContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* @media (max-width: 1024px) {
    justify-content: left;
  } */
`;

export const TasksCount = styled.div`
  /* animation: ${fadeIn} 0.5s ease-in; */
  border: 3px solid #b624ff;
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: left;
  gap: 8px 16px;
  padding: 12px 24px;
  margin: 24px 0 12px 0;
  border-radius: 16px;
`;

export const TaskCountTextContainer = styled.div`
  line-height: 1.75em;
`;

export const TaskCountHeader = styled.h4`
  margin: 0;
`;

export const TaskCompletionText = styled.p`
  margin: 0;
`;

export const DeleteDoneBtn = styled.button`
  position: fixed;
  display: flex;
  cursor: pointer;
  border: none;
  font-weight: bold;
  bottom: 24px;
  width: auto;
  height: 64px;
  font-size: 17px;
  padding: 18px;
  background-color: #ff453f;
  color: white;
  border-radius: 18px;
`;
