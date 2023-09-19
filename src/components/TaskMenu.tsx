import { ContentCopy, Delete, Done, Edit, Launch, PushPin } from "@mui/icons-material";
import { User } from "../types/user";
import { Divider, Menu, MenuItem } from "@mui/material";
import { BottomSheet } from "react-spring-bottom-sheet";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import styled from "@emotion/styled";
import "react-spring-bottom-sheet/dist/style.css";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";
import { ColorPalette } from "../styles";
import { useNavigate } from "react-router-dom";

//TODO: Move all functions to TasksMenu component

interface TaskMenuProps {
  user: User;
  selectedTaskId: number | null;
  setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorEl: null | HTMLElement;
  handleMarkAsDone: () => void;
  handlePin: () => void;
  handleDeleteTask: () => void;
  handleDuplicateTask: () => void;
  handleCloseMoreMenu: () => void;
}

export const TaskMenu = ({
  user,
  selectedTaskId,
  setEditModalOpen,
  anchorEl,
  handleMarkAsDone,
  handlePin,
  handleDeleteTask,
  handleDuplicateTask,
  handleCloseMoreMenu,
}: TaskMenuProps) => {
  const n = useNavigate();
  const menuItems: JSX.Element = (
    <div>
      <StyledMenuItem
        onClick={() => {
          handleCloseMoreMenu();
          handleMarkAsDone();
        }}
      >
        <Done /> &nbsp;{" "}
        {user.tasks.find((task) => task.id === selectedTaskId)?.done
          ? "Mark as not done"
          : "Mark as done"}
      </StyledMenuItem>
      <StyledMenuItem
        onClick={() => {
          handleCloseMoreMenu();
          handlePin();
        }}
      >
        <PushPin /> &nbsp;{" "}
        {user.tasks.find((task) => task.id === selectedTaskId)?.pinned ? "Unpin" : "Pin"}
      </StyledMenuItem>
      <StyledMenuItem
        onClick={() => {
          n(
            `/task/${user.tasks
              .find((task) => task.id === selectedTaskId)
              ?.id.toString()
              .replace(".", "")}`
          );
        }}
      >
        <Launch /> &nbsp; Task details
      </StyledMenuItem>
      <Divider />
      <StyledMenuItem
        onClick={() => {
          handleCloseMoreMenu();
          setEditModalOpen(true);
        }}
      >
        <Edit /> &nbsp; Edit
      </StyledMenuItem>
      <StyledMenuItem onClick={handleDuplicateTask}>
        <ContentCopy /> &nbsp; Duplicate
      </StyledMenuItem>
      <Divider />
      <StyledMenuItem
        clr={ColorPalette.red}
        onClick={() => {
          handleCloseMoreMenu();
          handleDeleteTask();
        }}
      >
        <Delete /> &nbsp; Delete
      </StyledMenuItem>
    </div>
  );
  const isMobile = useResponsiveDisplay();
  return (
    <>
      {isMobile ? (
        <BottomSheet
          open={Boolean(anchorEl)}
          onDismiss={handleCloseMoreMenu}
          snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight]}
          expandOnContentDrag
          header={
            <SheetHeader>
              <Emoji
                emojiStyle={user.emojisStyle}
                size={32}
                unified={user.tasks.find((task) => task.id === selectedTaskId)?.emoji || ""}
              />{" "}
              {user.emojisStyle === EmojiStyle.NATIVE && "\u00A0 "}
              {user.tasks.find((task) => task.id === selectedTaskId)?.name}
            </SheetHeader>
          }
          // footer={
          //   <div
          //     style={{
          //       display: "flex",
          //       justifyContent: "center",
          //       alignItems: "center",
          //     }}
          //   >
          //     <Button
          //       onClick={handleCloseMoreMenu}
          //       variant="outlined"
          //       sx={{
          //         borderRadius: "100px",
          //         width: "90%",
          //         padding: "12px",
          //         fontSize: "16px",
          //       }}
          //     >
          //       Dimiss
          //     </Button>
          //   </div>
          // }
        >
          <SheetContent>{menuItems}</SheetContent>
        </BottomSheet>
      ) : (
        <Menu
          id="task-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMoreMenu}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: "18px",
              minWidth: "200px",
              boxShadow: "none",
              padding: "2px 4px",
            },
          }}
          MenuListProps={{
            "aria-labelledby": "more-button",
          }}
        >
          {menuItems}
        </Menu>
      )}
    </>
  );
};

const SheetHeader = styled.h3`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  color: ${ColorPalette.fontDark};
  margin: 10px;
  font-size: 20px;
`;

const SheetContent = styled.div`
  color: ${ColorPalette.fontDark};
  margin: 20px 10px;
  & .MuiMenuItem-root {
    font-size: 16px;
    padding: 16px;
    &::before {
      content: "";
      display: inline-block;
      margin-right: 10px;
    }
  }
`;
const StyledMenuItem = styled(MenuItem)<{ clr?: string }>`
  margin: 6px;
  padding: 12px;
  border-radius: 12px;
  box-shadow: none;
  color: ${({ clr }) => clr};
  &:hover {
    background-color: #f0f0f0;
  }
`;
