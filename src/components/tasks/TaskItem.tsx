import { memo, useContext } from "react";
import { Emoji } from "emoji-picker-react";
import { DoneRounded, PushPinRounded, Link } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import type { Task, UUID } from "../../types/user";
import {
  TaskContainer,
  EmojiContainer,
  TaskInfo,
  Pinned,
  TaskHeader,
  TaskName,
  TaskDate,
  TaskDescription,
  TimeLeft,
  RingAlarm,
  StyledRadio,
  RadioChecked,
  RadioUnchecked,
  TaskCategoriesContainer,
  SharedByContainer,
} from "./tasks.styled";
import { calculateDateDifference, formatDate, getFontColor, systemInfo } from "../../utils";
import { RenderTaskDescription } from "./RenderTaskDescription";
import { CategoryBadge } from "..";
import { UserContext } from "../../contexts/UserContext";

interface TaskItemProps {
  task: Task;
  features?: {
    enableLinks?: boolean;
    enableGlow?: boolean;
    enableSelection?: boolean;
  };
  selection?: {
    selectedIds?: UUID[];
    onSelect?: (taskId: UUID) => void;
    onDeselect?: (taskId: UUID) => void;
  };
  onContextMenu?: (e: React.MouseEvent<Element>) => void;
  actions?: React.ReactNode;
  blur?: boolean;
  textHighlighter?: (text: string) => React.ReactNode;
}
/**
 * A reusable task component that displays task information with configurable features.
 * used across different views (TasksList, Share, ShareDialog) with consistent styling but varied behavior.
 */
export const TaskItem = memo(
  ({
    task,
    features = {},
    selection,
    onContextMenu,
    actions,
    blur,
    textHighlighter = (text) => text,
  }: TaskItemProps) => {
    const { user } = useContext(UserContext);
    const { settings } = user;

    const {
      enableLinks = true,
      enableGlow = settings.enableGlow,
      enableSelection = false,
    } = features;

    const { selectedIds = [], onSelect, onDeselect } = selection || {};

    const isSelected = selectedIds.includes(task.id);

    if (!task) {
      return null;
    }

    return (
      <TaskContainer
        id={task.id}
        onContextMenu={onContextMenu}
        backgroundColor={task.color}
        glow={enableGlow}
        done={task.done}
        blur={blur}
        isimportant={task.isimportant}
        data-testid="task-container"
      >
        {enableSelection && selectedIds.length > 0 && (
          <StyledRadio
            clr={getFontColor(task.color)}
            checked={isSelected}
            icon={<RadioUnchecked />}
            checkedIcon={<RadioChecked />}
            onChange={() => {
              if (isSelected) {
                onDeselect?.(task.id);
              } else {
                onSelect?.(task.id);
              }
            }}
          />
        )}

        {(task.emoji || task.done) && (
          <EmojiContainer clr={getFontColor(task.color)}>
            {task.done ? (
              <DoneRounded fontSize="large" />
            ) : (
              <Emoji
                size={systemInfo.os === "iOS" || systemInfo.os === "macOS" ? 50 : 38}
                unified={task.emoji || ""}
                emojiStyle={user.emojisStyle}
                lazyLoad
              />
            )}
          </EmojiContainer>
        )}

        <TaskInfo translate="no">
          {task.pinned && (
            <Pinned translate="yes">
              <PushPinRounded fontSize="small" /> &nbsp; Pinned
            </Pinned>
          )}
          <TaskHeader>
            <TaskName done={task.done}>{textHighlighter(task.name)}</TaskName>
            <Tooltip
              title={new Intl.DateTimeFormat(navigator.language, {
                dateStyle: "full",
                timeStyle: "medium",
              }).format(new Date(task.date))}
            >
              <TaskDate>{formatDate(new Date(task.date))}</TaskDate>
            </Tooltip>
          </TaskHeader>

          <TaskDescription done={task.done}>
            <RenderTaskDescription
              task={task}
              textHighlighter={textHighlighter}
              enableLinks={enableLinks}
            />
          </TaskDescription>

          {task.deadline && (
            <Tooltip
              title={new Intl.DateTimeFormat(navigator.language, {
                dateStyle: "full",
                timeStyle: "medium",
              }).format(new Date(task.deadline))}
              placement="bottom-start"
            >
              <TimeLeft done={task.done} translate="yes">
                <RingAlarm
                  fontSize="small"
                  animate={new Date() > new Date(task.deadline) && !task.done}
                  sx={{
                    color: `${getFontColor(task.color)} !important`,
                  }}
                />{" "}
                &nbsp;
                {new Date(task.deadline).toLocaleDateString()} {" • "}
                {new Date(task.deadline).toLocaleTimeString()}
                {!task.done && (
                  <>
                    {" • "}
                    {calculateDateDifference(new Date(task.deadline))}
                  </>
                )}
              </TimeLeft>
            </Tooltip>
          )}

          {task.sharedBy && (
            <SharedByContainer translate="yes">
              <Link /> Shared by{" "}
              <span translate={task.sharedBy === "User" ? "yes" : "no"}>{task.sharedBy}</span>
            </SharedByContainer>
          )}

          {settings.enableCategories && task.category && (
            <TaskCategoriesContainer>
              {task.category.map((category) => (
                <CategoryBadge
                  key={category.id}
                  category={category}
                  borderclr={getFontColor(task.color)}
                  sx={{
                    ...(features.enableGlow === false ? { boxShadow: "none" } : {}),
                  }}
                />
              ))}
            </TaskCategoriesContainer>
          )}
        </TaskInfo>

        {actions}
      </TaskContainer>
    );
  },
);
