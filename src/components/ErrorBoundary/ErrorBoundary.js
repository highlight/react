var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
var INITIAL_STATE = {
    componentStack: null,
    error: null,
    eventId: null,
};
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = INITIAL_STATE;
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
        _this.resetErrorBoundary = function () {
            var onReset = _this.props.onReset;
            var _a = _this.state, error = _a.error, componentStack = _a.componentStack, eventId = _a.eventId;
            if (onReset) {
                onReset(error, componentStack, eventId);
            }
            _this.setState(INITIAL_STATE);
        };
        return _this;
    }
    //   static getDerivedStateFromError(error: Error) {
    //     // Update state so the next render will show the fallback UI.
    //     return { error };
    //   }
    ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        console.log("componenet did catch");
        var _a = this.props, beforeCapture = _a.beforeCapture, onError = _a.onError, showDialog = _a.showDialog, dialogOptions = _a.dialogOptions;
        console.info("boba");
        console.error("Uncaught error:", error, errorInfo);
        console.log(dialogOptions);
        if (beforeCapture) {
            beforeCapture(error, errorInfo.componentStack);
        }
        var eventId = captureReactErrorBoundaryError(error, errorInfo.componentStack);
        if (onError) {
            onError(error, errorInfo.componentStack, eventId);
        }
        if (showDialog) {
            //       showReportDialog({ ...dialogOptions, eventId });
            console.log("show");
        }
        // componentDidCatch is used over getDerivedStateFromError
        // so that componentStack is accessible through state.
        this.setState({ error: error, componentStack: errorInfo.componentStack, eventId: eventId });
    };
    ErrorBoundary.prototype.render = function () {
        console.log(this.state);
        if (this.state.error) {
            return (_jsx("main", { children: _jsx("h1", { children: "Sorry.. there was an error" }, void 0) }, void 0));
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(React.Component));
export { ErrorBoundary };
/**
 * Logs react error boundary errors to Sentry. If on React version >= 17, creates stack trace
 * from componentStack param, otherwise relies on error param for stacktrace.
 *
 * @param error An error captured by React Error Boundary
 * @param componentStack The component stacktrace
 */
function captureReactErrorBoundaryError(error, componentStack) {
    var errorBoundaryError = new Error(error.message);
    errorBoundaryError.name = "React ErrorBoundary " + errorBoundaryError.name;
    errorBoundaryError.stack = componentStack;
    console.log(errorBoundaryError);
    return "";
}
