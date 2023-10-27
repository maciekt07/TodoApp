import { useParams } from "react-router-dom";
import { UserProps } from "../types/user";
import { TopBar } from "../components";
import styled from "@emotion/styled";
import { CategoryChip } from "../styles";
import { Avatar } from "@mui/material";
import { NotFound } from "./NotFound";
import { Clear, Done } from "@mui/icons-material";
import { Emoji, EmojiStyle } from "emoji-picker-react";

export const TaskDetails = ({ user }: UserProps) => {
  const { id } = useParams();
  const formattedId = id?.replace(".", "");
  const task = user.tasks.find((task) => task.id.toString().replace(".", "") === formattedId);

  if (!task) {
    return <NotFound />;
  }

  return (
    <>
      <TopBar title="Task Details" />
      <Container
        style={{ border: `2px solid ${task.color}`, boxShadow: `0 0 300px -50px ${task.color}` }}
      >
        <TaskName>Task: {task.name}</TaskName>
        <TaskTable>
          <tbody>
            <TableRow>
              <TableHeader>Emoji:</TableHeader>
              <TableData>
                {task.emoji ? (
                  <>
                    <Emoji unified={task?.emoji || ""} size={32} emojiStyle={user.emojisStyle} /> (
                    {task.emoji})
                  </>
                ) : (
                  <i>none</i>
                )}
              </TableData>
            </TableRow>

            <TableRow>
              <TableHeader>Description:</TableHeader>
              <TableData>{task?.description}</TableData>
            </TableRow>
            <TableRow>
              <TableHeader>Color:</TableHeader>
              <TableData>
                <ColorSquare style={{ background: task?.color }} /> {task?.color}
              </TableData>
            </TableRow>
            <TableRow>
              <TableHeader>Created:</TableHeader>
              <TableData>{new Date(task?.date || "").toLocaleString()}</TableData>
            </TableRow>
            {task?.lastSave && (
              <TableRow>
                <TableHeader>Last edited:</TableHeader>
                <TableData>{new Date(task?.lastSave || "").toLocaleString()}</TableData>
              </TableRow>
            )}
            {task?.deadline && (
              <TableRow>
                <TableHeader>Task deadline:</TableHeader>
                <TableData>{new Date(task?.deadline || "").toLocaleString()}</TableData>
              </TableRow>
            )}
            <TableRow>
              <TableHeader>Done:</TableHeader>
              <TableData>
                {task?.done ? <Done /> : <Clear />} {task?.done.toString()}
              </TableData>
            </TableRow>
            <TableRow>
              <TableHeader>Pinned:</TableHeader>
              <TableData>
                {task?.pinned ? <Done /> : <Clear />} {task?.pinned.toString()}
              </TableData>
            </TableRow>
            <TableRow>
              <TableHeader>Categories:</TableHeader>
              <TableData>
                <CategoryContainer>
                  {task?.category?.map((cat) => (
                    <CategoryChip
                      key={cat.id}
                      backgroundclr={cat.color}
                      glow={false}
                      label={cat.name}
                      avatar={
                        cat.emoji ? (
                          <Avatar
                            alt={cat.name}
                            sx={{
                              background: "transparent",
                              borderRadius: "0px",
                            }}
                          >
                            {cat.emoji &&
                              (user.emojisStyle === EmojiStyle.NATIVE ? (
                                <div>
                                  <Emoji
                                    size={18}
                                    unified={cat.emoji}
                                    emojiStyle={EmojiStyle.NATIVE}
                                  />
                                </div>
                              ) : (
                                <Emoji
                                  size={20}
                                  unified={cat.emoji}
                                  emojiStyle={user.emojisStyle}
                                />
                              ))}
                          </Avatar>
                        ) : (
                          <></>
                        )
                      }
                    />
                  ))}
                </CategoryContainer>
              </TableData>
            </TableRow>
          </tbody>
        </TaskTable>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #3a3d5a;
  padding: 16px 24px;
  border-radius: 24px;
  margin: 0 auto;
  margin-top: 100px;
`;

const TaskName = styled.h2`
  margin: 8px;
  text-align: center;
`;

const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  border-bottom: 2px solid #d9d9d9bc;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 8px;
`;

const TableData = styled.td`
  text-align: left;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ColorSquare = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
`;

const CategoryContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
`;
