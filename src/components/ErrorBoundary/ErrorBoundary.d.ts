import React, { ErrorInfo } from "react";
import { ReportDialogProps } from "../ReportDialog/ReportDialog";
export declare type FallbackRender = (errorData: {
    error: Error;
    componentStack: string | null;
    eventId: string | null;
    resetError(): void;
}) => React.ReactElement;
export declare type ErrorBoundaryProps = {
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
    onReset?(error: Error | null, componentStack: string | null, eventId: string | null): void;
    /** Called on componentWillUnmount() */
    onUnmount?(error: Error | null, componentStack: string | null, eventId: string | null): void;
    /** Called before the error is captured by Sentry, allows for you to add tags or context using the scope */
    beforeCapture?(error: Error | null, componentStack: string | null): void;
};
interface ErrorBoundaryState {
    componentStack: string | null;
    error: Error | null;
    eventId: string | null;
}
export declare class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    resetErrorBoundary: () => void;
    render(): React.ReactNode;
}
export {};
