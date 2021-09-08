import React, { ErrorInfo } from "react";
import { ReportDialogProps } from "../ReportDialog/ReportDialog";

export type FallbackRender = (errorData: {
  error: Error;
  componentStack: string | null;
  eventId: string | null;
  resetError(): void;
}) => React.ReactElement;

export type ErrorBoundaryProps = {
  /** If a Sentry report dialog should be rendered on error */
  showDialog?: boolean;
  /**
   * Options to be passed into the Sentry report dialog.
   * No-op if {@link showDialog} is false.
   */
  dialogOptions?: ReportDialogProps;
  /**
   * A fallback component that gets rendered when the error boundary encounters an error.
   *
   * Can either provide a React Component, or a function that returns React Component as
   * a valid fallback prop. If a function is provided, the function will be called with
   * the error, the component stack, and an function that resets the error boundary on error.
   *
   */
  fallback?: React.ReactElement | FallbackRender;
  /** Called when the error boundary encounters an error */
  onError?(error: Error, componentStack: string, eventId: string): void;
  /** Called on componentDidMount() */
  onMount?(): void;
  /** Called if resetError() is called from the fallback render props function  */
  onReset?(
    error: Error | null,
    componentStack: string | null,
    eventId: string | null
  ): void;
  /** Called on componentWillUnmount() */
  onUnmount?(
    error: Error | null,
    componentStack: string | null,
    eventId: string | null
  ): void;
  /** Called before the error is captured by Sentry, allows for you to add tags or context using the scope */
  beforeCapture?(error: Error | null, componentStack: string | null): void;
};

interface ErrorBoundaryState {
  componentStack: string | null;
  error: Error | null;
  eventId: string | null;
}

const INITIAL_STATE: ErrorBoundaryState = {
  componentStack: null,
  error: null,
  eventId: null,
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = INITIAL_STATE;

  //   static getDerivedStateFromError(error: Error) {
  //     // Update state so the next render will show the fallback UI.
  //     return { error };
  //   }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log("componenet did catch");
    const { beforeCapture, onError, showDialog, dialogOptions } = this.props;
    console.info("boba");
    console.error("Uncaught error:", error, errorInfo);
    console.log(dialogOptions);

    if (beforeCapture) {
      beforeCapture(error, errorInfo.componentStack);
    }
    const eventId = captureReactErrorBoundaryError(
      error,
      errorInfo.componentStack
    );
    if (onError) {
      onError(error, errorInfo.componentStack, eventId);
    }
    if (showDialog) {
      //       showReportDialog({ ...dialogOptions, eventId });
      console.log("show");
    }

    // componentDidCatch is used over getDerivedStateFromError
    // so that componentStack is accessible through state.
    this.setState({ error, componentStack: errorInfo.componentStack, eventId });
  }

  //   public componentDidMount(): void {
  //     const { onMount } = this.props;
  //     if (onMount) {
  //       onMount();
  //     }
  //   }

  //   public componentWillUnmount(): void {
  //     const { error, componentStack, eventId } = this.state;
  //     const { onUnmount } = this.props;
  //     if (onUnmount) {
  //       onUnmount(error, componentStack, eventId);
  //     }
  //   }

  resetErrorBoundary: () => void = () => {
    const { onReset } = this.props;
    const { error, componentStack, eventId } = this.state;
    if (onReset) {
      onReset(error, componentStack, eventId);
    }
    this.setState(INITIAL_STATE);
  };

  render() {
    console.log(this.state);

    if (this.state.error) {
      return (
        <main>
          <h1>Sorry.. there was an error</h1>
        </main>
      );
    }

    return this.props.children;
  }
}

/**
 * Logs react error boundary errors to Sentry. If on React version >= 17, creates stack trace
 * from componentStack param, otherwise relies on error param for stacktrace.
 *
 * @param error An error captured by React Error Boundary
 * @param componentStack The component stacktrace
 */
function captureReactErrorBoundaryError(
  error: Error,
  componentStack: string
): string {
  const errorBoundaryError = new Error(error.message);
  errorBoundaryError.name = `React ErrorBoundary ${errorBoundaryError.name}`;
  errorBoundaryError.stack = componentStack;

  console.log(errorBoundaryError);

  return "";
}
