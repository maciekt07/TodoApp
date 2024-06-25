import { useParams } from "react-router-dom";
import { CategoryBadge, TopBar } from "../components";
import styled from "@emotion/styled";
import { PathName } from "../styles";
import NotFound from "./NotFound";
import { Clear, Done } from "@mui/icons-material";
import { Emoji } from "emoji-picker-react";
import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { getColorName } from "ntc-ts";

const TaskDetails = () => {
  const { user } = useContext(UserContext);
  const { tasks, emojisStyle } = user;
  const { id } = useParams();
  const formattedId = id?.replace(".", "");
  const task = tasks.find((task) => task.id.toString().replace(".", "") === formattedId);

  useEffect(() => {
    document.title = `Todo App - ${task?.name || "Task Details"}`;
  }, [task?.name]);

  if (!task) {
    return (
      <NotFound
        message={
          <div>
            Task with id <PathName>{formattedId}</PathName> was not found.
          </div>
        }
      />
    );
  }

  const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <>
      <TopBar title="Task Details" />
      <Container>
        <TaskName>
          Task: <span translate="no">{task.name}</span>
        </TaskName>
        <TaskTable>
          <tbody>
            <TableRow>
              <TableHeader>Emoji:</TableHeader>
              <TableData>
                {task.emoji ? (
                  <>
                    <Emoji unified={task?.emoji || ""} size={32} emojiStyle={emojisStyle} /> (
                    {task.emoji})
                  </>
                ) : (
                  <i>none</i>
                )}
              </TableData>
            </TableRow>
            <TableRow>
              <TableHeader>ID:</TableHeader>
              <TableData>{task?.id}</TableData>
            </TableRow>
            <TableRow>
              <TableHeader>Description:</TableHeader>
              <TableData translate="no">{task?.description}</TableData>
            </TableRow>
            <TableRow>
              <TableHeader>Color:</TableHeader>
              <TableData>
                <ColorSquare clr={task.color} />
                {getColorName(task.color).name} ({task.color.toUpperCase()})
              </TableData>
            </TableRow>
            <TableRow>
              <TableHeader>Created:</TableHeader>
              <TableData>{dateFormatter.format(new Date(task.date))}</TableData>
            </TableRow>
            {task?.lastSave && (
              <TableRow>
                <TableHeader>Last edited:</TableHeader>
                <TableData>{dateFormatter.format(new Date(task.lastSave))}</TableData>
              </TableRow>
            )}
            {task?.deadline && (
              <TableRow>
                <TableHeader>Task deadline:</TableHeader>
                <TableData>{dateFormatter.format(new Date(task.deadline))}</TableData>
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
            {task?.sharedBy && (
              <TableRow>
                <TableHeader>Shared by: </TableHeader>
                <TableData>{task.sharedBy}</TableData>
              </TableRow>
            )}
            {task.category && task.category.length > 0 && (
              <TableRow>
                <TableHeader>Categories:</TableHeader>
                <TableData>
                  <CategoryContainer>
                    {task?.category?.map((category) => (
                      <CategoryBadge key={category.id} category={category} glow={false} />
                    ))}
                  </CategoryContainer>
                </TableData>
              </TableRow>
            )}
          </tbody>
        </TaskTable>
      </Container>
    </>
  );
};

export default TaskDetails;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 32px;
  margin: 0 auto;
  margin-top: 100px;
  box-shadow: 0 0px 24px 2px rgba(0, 0, 0, 0.3);

  @media (min-width: 768px) {
    padding: 24px;
    width: 70%;
  }
`;

const TaskName = styled.h2`
  margin: 8px;
  text-align: center;
  font-size: 1.5em;

  @media (min-width: 768px) {
    font-size: 1.8em;
  }
`;

const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const TableRow = styled.tr`
  border-bottom: 2px solid ${({ theme }) => theme.primary}41;

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 8px;
  font-size: 1em;

  @media (min-width: 768px) {
    font-size: 1.2em;
  }
`;

const TableData = styled.td`
  text-align: left;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1em;
  word-break: break-all;
  @media (min-width: 768px) {
    font-size: 1.1em;
  }
`;

const ColorSquare = styled.div<{ clr: string }>`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background-color: ${({ clr }) => clr};
`;

const CategoryContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
`;
