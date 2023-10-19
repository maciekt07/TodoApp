import { useParams } from "react-router-dom";
import { UserProps } from "../types/user";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { TopBar } from "../components";
import styled from "@emotion/styled";
import { CategoryChip, ColorPalette } from "../styles";
import { Avatar } from "@mui/material";
import { NotFound } from "./NotFound";
import { Clear, Done } from "@mui/icons-material";

export const TaskDetails = ({ user }: UserProps) => {
  let { id } = useParams(); // Access the ID parameter from the URL
  const formattedId = id?.replace(".", "");
  const task = user.tasks.find((task) => task.id.toString().replace(".", "") === formattedId);

  if (!task) {
    return <NotFound />;
  }

  return (
    <>
      <TopBar title="Task Details" />

      <Container clr={task?.color || ColorPalette.purple}>
        <TaskName>
          <Emoji unified={task?.emoji || ""} emojiStyle={user.emojisStyle} /> {task?.name}
        </TaskName>

        <div
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "left",
            flexDirection: "column",
          }}
        >
          <TaskDetail>
            <b>Description:</b> {task?.description}
          </TaskDetail>
          <TaskDetail>
            <b>Color:</b>{" "}
            <div
              style={{
                width: "20px",
                height: "20px",
                background: task?.color,
                borderRadius: "4px",
              }}
            ></div>{" "}
            {task?.color}
          </TaskDetail>

          <TaskDetail>
            <b>Created:</b> {new Date(task?.date || "").toLocaleDateString()} {" • "}
            {new Date(task?.date || "").toLocaleTimeString()}
          </TaskDetail>
          {task?.lastSave && (
            <TaskDetail>
              <b>Last edited:</b> {new Date(task?.lastSave || "").toLocaleDateString()} {" • "}{" "}
              {new Date(task?.lastSave || "").toLocaleTimeString()}{" "}
            </TaskDetail>
          )}
          {task?.deadline && (
            <TaskDetail>
              <b>Task deadline:</b> {new Date(task?.deadline || "").toLocaleDateString()} {" • "}{" "}
              {new Date(task?.deadline || "").toLocaleTimeString()}{" "}
            </TaskDetail>
          )}
          <TaskDetail>
            <b>Done:</b> {task?.done ? <Done /> : <Clear />} {task?.done.toString()}
          </TaskDetail>
          <TaskDetail>
            <b>Pinned:</b>
            {task?.done ? <Done /> : <Clear />} {task?.pinned.toString()}
          </TaskDetail>

          <CategoryContainer>
            <b style={{ margin: "8px" }}>Categories:</b>
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
                            <Emoji size={18} unified={cat.emoji} emojiStyle={EmojiStyle.NATIVE} />
                          </div>
                        ) : (
                          <Emoji size={20} unified={cat.emoji} emojiStyle={user.emojisStyle} />
                        ))}
                    </Avatar>
                  ) : (
                    <></>
                  )
                }
              />
            ))}
          </CategoryContainer>
        </div>
      </Container>
    </>
  );
};

const Container = styled.div<{ clr: string }>`
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: column;
  background-color: #3a3d5a;
  padding: 16px 24px;
  border-radius: 24px;
  /* border: 4px solid ${({ clr }) => clr}; */
  @media (min-width: 1024px) {
    align-items: center;
    max-width: 70%;
    margin: 0 auto;
  }
`;

const CategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  align-items: center;
  float: left;
  gap: 6px;
`;

const TaskName = styled.h2`
  font-size: 28px;
  margin: 8px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
`;

const TaskDetail = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 8px;
`;
// {{ display: "flex", justifyContent: "left", alignItems: "center", gap: "6px" }}
