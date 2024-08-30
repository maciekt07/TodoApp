import {
  GitHub,
  ImageRounded,
  Language,
  Link,
  LinkedIn,
  Reddit,
  X,
  YouTube,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { memo, useContext } from "react";
import { DESCRIPTION_SHORT_LENGTH, URL_REGEX } from "../../constants";
import { useResponsiveDisplay } from "../../hooks/useResponsiveDisplay";
import { Task } from "../../types/user";
import { DescriptionLink, ShowMoreBtn, YouTubeThumbnail } from "./tasks.styled";
import { TaskContext } from "../../contexts/TaskContext";

interface RenderTaskDescriptionProps {
  task: Task;
}

/**
 * Function to render task description with links
 */
export const RenderTaskDescription = memo(
  ({ task }: RenderTaskDescriptionProps): JSX.Element | null => {
    const { expandedTasks, toggleShowMore, highlightMatchingText } = useContext(TaskContext);
    const isMobile = useResponsiveDisplay();

    if (!task || !task.description) {
      return null;
    }

    const { description, color, id } = task;
    const hasLinks = description.match(URL_REGEX);
    const isExpanded = expandedTasks.has(id);
    const highlightedDescription =
      isExpanded || hasLinks ? description : description.slice(0, DESCRIPTION_SHORT_LENGTH);

    const parts = highlightedDescription.split(URL_REGEX);

    interface DomainMappings {
      regex: RegExp;
      domainName?: string;
      icon: JSX.Element;
    }

    const domainMappings: DomainMappings[] = [
      { regex: /(m\.)?youtu(\.be|be\.com)/, domainName: "Youtube", icon: <YouTube /> },
      {
        regex: /(twitter\.com|x\.com)/,
        domainName: "X",
        icon: <X sx={{ fontSize: "18px" }} />,
      },
      { regex: /github\.com/, domainName: "Github", icon: <GitHub sx={{ fontSize: "20px" }} /> },
      { regex: /reddit\.com/, domainName: "Reddit", icon: <Reddit /> },
      { regex: /linkedin\.com/, domainName: "LinkedIn", icon: <LinkedIn /> },
      { regex: /localhost/, icon: <Language /> },
      { regex: /.*/, icon: <Link /> }, // Default icon for other domains
    ];

    const descriptionWithLinks = parts.map((part, index) => {
      if (index % 2 === 0) {
        return highlightMatchingText(part);
      } else {
        let domain: string = "";
        let icon: JSX.Element = <Link />;

        try {
          const url = new URL(part);
          domain = url.hostname.replace("www.", "");
          // Find the matching icon for the domain
          const mapping = domainMappings.find(({ regex }) => domain.match(regex));
          icon = mapping ? mapping.icon : <Link />; // Default to Link icon
          domain =
            mapping && mapping.domainName ? mapping.domainName : url.hostname.replace("www.", "");
        } catch (error) {
          // If URL construction fails
          console.error(`Invalid URL: ${part}`, error);
        }

        // Check if part matches any image file extensions
        if (part.match(/\.(jpeg|jpg|gif|png|bmp|svg|tif|tiff|webp)$/)) {
          icon = <ImageRounded />;
        }

        const youtubeId = (youtubeLink: string) =>
          youtubeLink.match(
            /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/,
          )?.[1] || null;

        return (
          <Tooltip
            title={
              <>
                <span style={{ wordBreak: "break-all" }}>{part}</span>
                {part.match(domainMappings[0].regex) && youtubeId(part) && !isMobile && (
                  <YouTubeThumbnail>
                    <img
                      src={`https://i.ytimg.com/vi/${youtubeId(part)}/hqdefault.jpg`}
                      alt="YouTube Thumbnail"
                      loading="lazy"
                    />
                  </YouTubeThumbnail>
                )}
              </>
            }
            key={index}
          >
            <a href={part} target="_blank" rel="noreferrer">
              <DescriptionLink role="link" data-href={part} clr={color}>
                <div>
                  {icon} {highlightMatchingText(domain)}
                </div>
              </DescriptionLink>
            </a>
          </Tooltip>
        );
      }
    });

    return (
      <div>
        {descriptionWithLinks}{" "}
        {task.description && task.description.length > DESCRIPTION_SHORT_LENGTH && !hasLinks && (
          <ShowMoreBtn onClick={() => toggleShowMore(task.id)} clr={task.color}>
            {expandedTasks.has(task.id) ? "Show less" : "Show more"}
          </ShowMoreBtn>
        )}
      </div>
    );
  },
);
