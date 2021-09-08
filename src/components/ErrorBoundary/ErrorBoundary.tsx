import React, { ErrorInfo } from "react";
import ReportDialog, {
  ReportDialogOptions,
} from "../ReportDialog/ReportDialog";

export type FallbackRender = (errorData: {
  error: Error;
  componentStack: string | null;
  resetError(): void;
}) => React.ReactElement;

export type ErrorBoundaryProps = {
  /** If a Highlight report dialog should be rendered on error */
  showDialog?: boolean;
  /**
   * Options to be passed into the Highlight report dialog.
   * No-op if {@link showDialog} is false.
   */
  dialogOptions?: ReportDialogOptions;
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
  onError?(error: Error, componentStack: string): void;
  /** Called on componentDidMount() */
  onMount?(): void;
  /** Called if resetError() is called from the fallback render props function  */
  onReset?(error: Error | null, componentStack: string | null): void;
  /** Called on componentWillUnmount() */
  onUnmount?(error: Error | null, componentStack: string | null): void;
  /** Called before the error is captured by Highlight, allows for you to add tags or context using the scope */
  beforeCapture?(error: Error | null, componentStack: string | null): void;
};

interface ErrorBoundaryState {
  componentStack: string | null;
  error: Error | null;
  showingDialog: boolean;
}

const INITIAL_STATE: ErrorBoundaryState = {
  componentStack: null,
  error: null,
  showingDialog: false,
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = INITIAL_STATE;

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { beforeCapture, onError, showDialog } = this.props;

    if (beforeCapture) {
      beforeCapture(error, errorInfo.componentStack);
    }
    captureReactErrorBoundaryError(error, errorInfo.componentStack);
    if (onError) {
      onError(error, errorInfo.componentStack);
    }
    if (showDialog) {
      this.setState({ ...this.state, showingDialog: true });
    }

    // componentDidCatch is used over getDerivedStateFromError
    // so that componentStack is accessible through state.
    this.setState({ error, componentStack: errorInfo.componentStack });
  }

  public componentDidMount(): void {
    const { onMount } = this.props;
    if (onMount) {
      onMount();
    }
  }

  public componentWillUnmount(): void {
    const { error, componentStack } = this.state;
    const { onUnmount } = this.props;
    if (onUnmount) {
      onUnmount(error, componentStack);
    }
  }

  resetErrorBoundary: () => void = () => {
    const { onReset } = this.props;
    const { error, componentStack } = this.state;
    if (onReset) {
      onReset(error, componentStack);
    }
    this.setState(INITIAL_STATE);
  };

  hideDialog: () => void = () => {
    this.setState({ ...this.state, showingDialog: false });
  };

  render() {
    const { fallback, children } = this.props;
    const { error, componentStack, showingDialog } = this.state;

    if (error) {
      let element: React.ReactElement | undefined = undefined;
      if (typeof fallback === "function") {
        element = fallback({
          error,
          componentStack,
          resetError: this.resetErrorBoundary,
        });
      } else {
        element = fallback;
      }

      if (React.isValidElement(element)) {
        return (
          <>
            {showingDialog && (
              <ReportDialog
                {...this.props.dialogOptions}
                onCloseHandler={this.hideDialog}
              />
            )}
            {element}
          </>
        );
      }

      if (fallback) {
        console.warn("fallback did not produce a valid ReactElement");
      }

      // Fail gracefully if no fallback provided or is not valid
      return null;
    }

    if (typeof children === "function") {
      return children();
    }

    return children;
  }
}

/**
 * Logs react error boundary errors to Highlight.
 *
 * @param error An error captured by React Error Boundary
 * @param componentStack The component stacktrace
 */
function captureReactErrorBoundaryError(
  error: Error,
  componentStack: string
): void {
  const errorBoundaryError = new Error(error.message);
  errorBoundaryError.name = `React ErrorBoundary ${errorBoundaryError.name}`;
  errorBoundaryError.stack = componentStack;

  console.log(errorBoundaryError);
  console.log(error);
}