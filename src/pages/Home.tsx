import { useState, useEffect } from "react";
import { AddTaskBtn, ProfileAvatar, Tasks } from "../components";
import { DeleteDoneBtn, GreetingHeader, GreetingText } from "../styles";
import { UserProps } from "../types/user";
import { displayGreeting, getRandomGreeting } from "../utils";
import { Delete } from "@mui/icons-material";
import { Emoji } from "emoji-picker-react";

export const Home = ({ user, setUser }: UserProps) => {
  const [randomGreeting, setRandomGreeting] = useState<string>("");
  const [completedTasksCount, setCompletedTasksCount] = useState<number>(0);
  useEffect(() => {
    setRandomGreeting(getRandomGreeting());
    document.title = "Todo App";
  }, []);

  const handleDeleteDone = () => {
    setUser((prevUser) => {
      const updatedTasks = prevUser.tasks.filter((task) => !task.done);
      return { ...prevUser, tasks: updatedTasks };
    });
  };
  useEffect(() => {
    const count = user.tasks.filter((task) => task.done).length;
    setCompletedTasksCount(count);
  }, [user.tasks]);
  return (
    <>
      <ProfileAvatar user={user} setUser={setUser} />
      <GreetingHeader>
        <Emoji unified="1f44b" emojiStyle={user.emojisStyle} /> &nbsp;{" "}
        {displayGreeting()}
        {user.name && ", " + user.name}
      </GreetingHeader>
      <GreetingText>{randomGreeting}</GreetingText>
      {user.tasks.length > 0 && (
        <h4>
          You have {user.tasks.length - completedTasksCount} unfinished tasks{" "}
          {completedTasksCount > 0 && `and ${completedTasksCount} done`}
        </h4>
      )}
      <Tasks user={user} setUser={setUser} />
      {user.tasks.some((task) => task.done) && (
        <DeleteDoneBtn onClick={handleDeleteDone}>
          <Delete /> &nbsp; Delete done
        </DeleteDoneBtn>
      )}
      <AddTaskBtn animate={user.tasks.length === 0} />
    </>
  );
};
