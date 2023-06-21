import React, { ErrorInfo } from "react";
import { User } from "../types/user";
import { StyledLink } from "../styles";

interface ErrorBoundaryProps {
  // fallbackUI: React.ReactNode;
  user: User;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary component that catches and displays errors within its children.
 */

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
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
      return (
        <div>
          <h1 style={{ color: "#ff3131" }}>Oops! An error occurred 🙄.</h1>{" "}
          <h2>
            To fix it, try clearing your local files (cookies and cache) and
            then refresh the page. If the problem persists, please report the
            issue via{" "}
            <StyledLink href="https://github.com/maciekt07/TodoApp/issues">
              Github Issues
            </StyledLink>
            .
          </h2>
          <h3>
            <span style={{ color: "#ff3131" }}>ERROR:</span> [
            {this.state.error?.name}] {this.state.error?.message}{" "}
          </h3>
          <pre>
            <code>{JSON.stringify(this.props.user, null, 4)}</code>
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
