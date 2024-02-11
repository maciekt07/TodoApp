import React, { ErrorInfo } from "react";
import { StyledLink } from "../styles";
import { Emoji } from "emoji-picker-react";
import { Button } from "@mui/material";
import { exportTasksToJson } from "../utils";
import { Delete, FileDownload } from "@mui/icons-material";
import toast from "react-hot-toast";
import { UserContext } from "../contexts/UserContext";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary component that catches and displays errors within its children.
 */

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static contextType = UserContext;
  declare context: React.ContextType<typeof UserContext>;
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error: error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { user } = this.context;
      return (
        <div>
          <h1
            style={{
              color: "#ff3131",
              alignItems: "center",
            }}
          >
            <span>Oops! An error occurred.&nbsp;</span>
            <Emoji size={32} unified="1f644" />
          </h1>
          <h2>
            To fix it, try clearing your local files (cookies and cache) and then refresh the page.
            If the problem persists, please report the issue via{" "}
            <StyledLink href="https://github.com/maciekt07/TodoApp/issues">
              Github Issues
            </StyledLink>
            .
          </h2>
          <div
            style={{
              margin: "16px 0",
            }}
          >
            <Button
              size="large"
              variant="outlined"
              sx={{ p: "10px 20px", borderRadius: "12px" }}
              onClick={() => {
                localStorage.clear();
                location.reload();
              }}
            >
              <Delete /> &nbsp; Auto Clear
            </Button>
          </div>
          <h3>
            <span style={{ color: "#ff3131" }}>ERROR:</span> [{this.state.error?.name}]{" "}
            {this.state.error?.message}
          </h3>
          <details
            style={{
              border: "2px solid #ffffff2e",
              padding: "8px",
              borderRadius: "8px",
              background: "#ffffff15",
            }}
          >
            <summary>Error stack</summary>
            <div style={{ opacity: 0.8, fontSize: "12px" }}>
              {this.state.error?.stack?.replace(this.state.error?.message, "")}
            </div>
          </details>
          <pre>
            <Button
              variant="outlined"
              sx={{ m: "14px 6px", p: "12px 20px", borderRadius: "14px" }}
              onClick={() => {
                exportTasksToJson(user.tasks);
                toast.success(`Exported all tasks (${user.tasks.length})`);
              }}
            >
              <FileDownload /> &nbsp; Export Tasks To JSON
            </Button>
            <br />
            <code>{JSON.stringify(user, null, 4)}</code>
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
