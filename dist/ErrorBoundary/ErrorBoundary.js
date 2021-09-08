"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorBoundary = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var INITIAL_STATE = {
  componentStack: null,
  error: null,
  eventId: null
};

var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
  _inherits(ErrorBoundary, _React$Component);

  var _super = _createSuper(ErrorBoundary);

  function ErrorBoundary() {
    var _this;

    _classCallCheck(this, ErrorBoundary);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", INITIAL_STATE);

    _defineProperty(_assertThisInitialized(_this), "resetErrorBoundary", function () {
      var onReset = _this.props.onReset;
      var _this$state = _this.state,
          error = _this$state.error,
          componentStack = _this$state.componentStack,
          eventId = _this$state.eventId;

      if (onReset) {
        onReset(error, componentStack, eventId);
      }

      _this.setState(INITIAL_STATE);
    });

    return _this;
  }

  _createClass(ErrorBoundary, [{
    key: "componentDidCatch",
    value: //   static getDerivedStateFromError(error: Error) {
    //     // Update state so the next render will show the fallback UI.
    //     return { error };
    //   }
    function componentDidCatch(error, errorInfo) {
      console.log("componenet did catch");
      var _this$props = this.props,
          beforeCapture = _this$props.beforeCapture,
          onError = _this$props.onError,
          showDialog = _this$props.showDialog,
          dialogOptions = _this$props.dialogOptions;
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
      } // componentDidCatch is used over getDerivedStateFromError
      // so that componentStack is accessible through state.


      this.setState({
        error: error,
        componentStack: errorInfo.componentStack,
        eventId: eventId
      });
    } //   public componentDidMount(): void {
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

  }, {
    key: "render",
    value: function render() {
      console.log(this.state);

      if (this.state.error) {
        return /*#__PURE__*/_react.default.createElement("main", null, /*#__PURE__*/_react.default.createElement("h1", null, "Sorry.. there was an error"));
      }

      return this.props.children;
    }
  }]);

  return ErrorBoundary;
}(_react.default.Component);
/**
 * Logs react error boundary errors to Sentry. If on React version >= 17, creates stack trace
 * from componentStack param, otherwise relies on error param for stacktrace.
 *
 * @param error An error captured by React Error Boundary
 * @param componentStack The component stacktrace
 */


exports.ErrorBoundary = ErrorBoundary;

function captureReactErrorBoundaryError(error, componentStack) {
  var errorBoundaryError = new Error(error.message);
  errorBoundaryError.name = "React ErrorBoundary ".concat(errorBoundaryError.name);
  errorBoundaryError.stack = componentStack;
  console.log(errorBoundaryError);
  return "";
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0Vycm9yQm91bmRhcnkvRXJyb3JCb3VuZGFyeS50c3giXSwibmFtZXMiOlsiSU5JVElBTF9TVEFURSIsImNvbXBvbmVudFN0YWNrIiwiZXJyb3IiLCJldmVudElkIiwiRXJyb3JCb3VuZGFyeSIsIm9uUmVzZXQiLCJwcm9wcyIsInN0YXRlIiwic2V0U3RhdGUiLCJlcnJvckluZm8iLCJjb25zb2xlIiwibG9nIiwiYmVmb3JlQ2FwdHVyZSIsIm9uRXJyb3IiLCJzaG93RGlhbG9nIiwiZGlhbG9nT3B0aW9ucyIsImluZm8iLCJjYXB0dXJlUmVhY3RFcnJvckJvdW5kYXJ5RXJyb3IiLCJjaGlsZHJlbiIsIlJlYWN0IiwiQ29tcG9uZW50IiwiZXJyb3JCb3VuZGFyeUVycm9yIiwiRXJyb3IiLCJtZXNzYWdlIiwibmFtZSIsInN0YWNrIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxREEsSUFBTUEsYUFBaUMsR0FBRztBQUN4Q0MsRUFBQUEsY0FBYyxFQUFFLElBRHdCO0FBRXhDQyxFQUFBQSxLQUFLLEVBQUUsSUFGaUM7QUFHeENDLEVBQUFBLE9BQU8sRUFBRTtBQUgrQixDQUExQzs7SUFNYUMsYTs7Ozs7Ozs7Ozs7Ozs7Ozs0REFJd0JKLGE7O3lFQWlERixZQUFNO0FBQ3JDLFVBQVFLLE9BQVIsR0FBb0IsTUFBS0MsS0FBekIsQ0FBUUQsT0FBUjtBQUNBLHdCQUEyQyxNQUFLRSxLQUFoRDtBQUFBLFVBQVFMLEtBQVIsZUFBUUEsS0FBUjtBQUFBLFVBQWVELGNBQWYsZUFBZUEsY0FBZjtBQUFBLFVBQStCRSxPQUEvQixlQUErQkEsT0FBL0I7O0FBQ0EsVUFBSUUsT0FBSixFQUFhO0FBQ1hBLFFBQUFBLE9BQU8sQ0FBQ0gsS0FBRCxFQUFRRCxjQUFSLEVBQXdCRSxPQUF4QixDQUFQO0FBQ0Q7O0FBQ0QsWUFBS0ssUUFBTCxDQUFjUixhQUFkO0FBQ0QsSzs7Ozs7OztXQXRERDtBQUNBO0FBQ0E7QUFDQTtBQUVBLCtCQUFrQkUsS0FBbEIsRUFBZ0NPLFNBQWhDLEVBQXNEO0FBQ3BEQyxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxzQkFBWjtBQUNBLHdCQUE4RCxLQUFLTCxLQUFuRTtBQUFBLFVBQVFNLGFBQVIsZUFBUUEsYUFBUjtBQUFBLFVBQXVCQyxPQUF2QixlQUF1QkEsT0FBdkI7QUFBQSxVQUFnQ0MsVUFBaEMsZUFBZ0NBLFVBQWhDO0FBQUEsVUFBNENDLGFBQTVDLGVBQTRDQSxhQUE1QztBQUNBTCxNQUFBQSxPQUFPLENBQUNNLElBQVIsQ0FBYSxNQUFiO0FBQ0FOLE1BQUFBLE9BQU8sQ0FBQ1IsS0FBUixDQUFjLGlCQUFkLEVBQWlDQSxLQUFqQyxFQUF3Q08sU0FBeEM7QUFDQUMsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlJLGFBQVo7O0FBRUEsVUFBSUgsYUFBSixFQUFtQjtBQUNqQkEsUUFBQUEsYUFBYSxDQUFDVixLQUFELEVBQVFPLFNBQVMsQ0FBQ1IsY0FBbEIsQ0FBYjtBQUNEOztBQUNELFVBQU1FLE9BQU8sR0FBR2MsOEJBQThCLENBQzVDZixLQUQ0QyxFQUU1Q08sU0FBUyxDQUFDUixjQUZrQyxDQUE5Qzs7QUFJQSxVQUFJWSxPQUFKLEVBQWE7QUFDWEEsUUFBQUEsT0FBTyxDQUFDWCxLQUFELEVBQVFPLFNBQVMsQ0FBQ1IsY0FBbEIsRUFBa0NFLE9BQWxDLENBQVA7QUFDRDs7QUFDRCxVQUFJVyxVQUFKLEVBQWdCO0FBQ2Q7QUFDQUosUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksTUFBWjtBQUNELE9BcEJtRCxDQXNCcEQ7QUFDQTs7O0FBQ0EsV0FBS0gsUUFBTCxDQUFjO0FBQUVOLFFBQUFBLEtBQUssRUFBTEEsS0FBRjtBQUFTRCxRQUFBQSxjQUFjLEVBQUVRLFNBQVMsQ0FBQ1IsY0FBbkM7QUFBbURFLFFBQUFBLE9BQU8sRUFBUEE7QUFBbkQsT0FBZDtBQUNELEssQ0FFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztXQVdBLGtCQUFTO0FBQ1BPLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLEtBQUtKLEtBQWpCOztBQUVBLFVBQUksS0FBS0EsS0FBTCxDQUFXTCxLQUFmLEVBQXNCO0FBQ3BCLDRCQUNFLHdEQUNFLHNFQURGLENBREY7QUFLRDs7QUFFRCxhQUFPLEtBQUtJLEtBQUwsQ0FBV1ksUUFBbEI7QUFDRDs7OztFQTFFZ0NDLGVBQU1DLFM7QUE2RXpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUNBLFNBQVNILDhCQUFULENBQ0VmLEtBREYsRUFFRUQsY0FGRixFQUdVO0FBQ1IsTUFBTW9CLGtCQUFrQixHQUFHLElBQUlDLEtBQUosQ0FBVXBCLEtBQUssQ0FBQ3FCLE9BQWhCLENBQTNCO0FBQ0FGLEVBQUFBLGtCQUFrQixDQUFDRyxJQUFuQixpQ0FBaURILGtCQUFrQixDQUFDRyxJQUFwRTtBQUNBSCxFQUFBQSxrQkFBa0IsQ0FBQ0ksS0FBbkIsR0FBMkJ4QixjQUEzQjtBQUVBUyxFQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWVUsa0JBQVo7QUFFQSxTQUFPLEVBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBFcnJvckluZm8gfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IFJlcG9ydERpYWxvZ1Byb3BzIH0gZnJvbSBcIi4uL1JlcG9ydERpYWxvZy9SZXBvcnREaWFsb2dcIjtcblxuZXhwb3J0IHR5cGUgRmFsbGJhY2tSZW5kZXIgPSAoZXJyb3JEYXRhOiB7XG4gIGVycm9yOiBFcnJvcjtcbiAgY29tcG9uZW50U3RhY2s6IHN0cmluZyB8IG51bGw7XG4gIGV2ZW50SWQ6IHN0cmluZyB8IG51bGw7XG4gIHJlc2V0RXJyb3IoKTogdm9pZDtcbn0pID0+IFJlYWN0LlJlYWN0RWxlbWVudDtcblxuZXhwb3J0IHR5cGUgRXJyb3JCb3VuZGFyeVByb3BzID0ge1xuICAvKiogSWYgYSBTZW50cnkgcmVwb3J0IGRpYWxvZyBzaG91bGQgYmUgcmVuZGVyZWQgb24gZXJyb3IgKi9cbiAgc2hvd0RpYWxvZz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBPcHRpb25zIHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBTZW50cnkgcmVwb3J0IGRpYWxvZy5cbiAgICogTm8tb3AgaWYge0BsaW5rIHNob3dEaWFsb2d9IGlzIGZhbHNlLlxuICAgKi9cbiAgZGlhbG9nT3B0aW9ucz86IFJlcG9ydERpYWxvZ1Byb3BzO1xuICAvKipcbiAgICogQSBmYWxsYmFjayBjb21wb25lbnQgdGhhdCBnZXRzIHJlbmRlcmVkIHdoZW4gdGhlIGVycm9yIGJvdW5kYXJ5IGVuY291bnRlcnMgYW4gZXJyb3IuXG4gICAqXG4gICAqIENhbiBlaXRoZXIgcHJvdmlkZSBhIFJlYWN0IENvbXBvbmVudCwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgUmVhY3QgQ29tcG9uZW50IGFzXG4gICAqIGEgdmFsaWQgZmFsbGJhY2sgcHJvcC4gSWYgYSBmdW5jdGlvbiBpcyBwcm92aWRlZCwgdGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdpdGhcbiAgICogdGhlIGVycm9yLCB0aGUgY29tcG9uZW50IHN0YWNrLCBhbmQgYW4gZnVuY3Rpb24gdGhhdCByZXNldHMgdGhlIGVycm9yIGJvdW5kYXJ5IG9uIGVycm9yLlxuICAgKlxuICAgKi9cbiAgZmFsbGJhY2s/OiBSZWFjdC5SZWFjdEVsZW1lbnQgfCBGYWxsYmFja1JlbmRlcjtcbiAgLyoqIENhbGxlZCB3aGVuIHRoZSBlcnJvciBib3VuZGFyeSBlbmNvdW50ZXJzIGFuIGVycm9yICovXG4gIG9uRXJyb3I/KGVycm9yOiBFcnJvciwgY29tcG9uZW50U3RhY2s6IHN0cmluZywgZXZlbnRJZDogc3RyaW5nKTogdm9pZDtcbiAgLyoqIENhbGxlZCBvbiBjb21wb25lbnREaWRNb3VudCgpICovXG4gIG9uTW91bnQ/KCk6IHZvaWQ7XG4gIC8qKiBDYWxsZWQgaWYgcmVzZXRFcnJvcigpIGlzIGNhbGxlZCBmcm9tIHRoZSBmYWxsYmFjayByZW5kZXIgcHJvcHMgZnVuY3Rpb24gICovXG4gIG9uUmVzZXQ/KFxuICAgIGVycm9yOiBFcnJvciB8IG51bGwsXG4gICAgY29tcG9uZW50U3RhY2s6IHN0cmluZyB8IG51bGwsXG4gICAgZXZlbnRJZDogc3RyaW5nIHwgbnVsbFxuICApOiB2b2lkO1xuICAvKiogQ2FsbGVkIG9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkgKi9cbiAgb25Vbm1vdW50PyhcbiAgICBlcnJvcjogRXJyb3IgfCBudWxsLFxuICAgIGNvbXBvbmVudFN0YWNrOiBzdHJpbmcgfCBudWxsLFxuICAgIGV2ZW50SWQ6IHN0cmluZyB8IG51bGxcbiAgKTogdm9pZDtcbiAgLyoqIENhbGxlZCBiZWZvcmUgdGhlIGVycm9yIGlzIGNhcHR1cmVkIGJ5IFNlbnRyeSwgYWxsb3dzIGZvciB5b3UgdG8gYWRkIHRhZ3Mgb3IgY29udGV4dCB1c2luZyB0aGUgc2NvcGUgKi9cbiAgYmVmb3JlQ2FwdHVyZT8oZXJyb3I6IEVycm9yIHwgbnVsbCwgY29tcG9uZW50U3RhY2s6IHN0cmluZyB8IG51bGwpOiB2b2lkO1xufTtcblxuaW50ZXJmYWNlIEVycm9yQm91bmRhcnlTdGF0ZSB7XG4gIGNvbXBvbmVudFN0YWNrOiBzdHJpbmcgfCBudWxsO1xuICBlcnJvcjogRXJyb3IgfCBudWxsO1xuICBldmVudElkOiBzdHJpbmcgfCBudWxsO1xufVxuXG5jb25zdCBJTklUSUFMX1NUQVRFOiBFcnJvckJvdW5kYXJ5U3RhdGUgPSB7XG4gIGNvbXBvbmVudFN0YWNrOiBudWxsLFxuICBlcnJvcjogbnVsbCxcbiAgZXZlbnRJZDogbnVsbCxcbn07XG5cbmV4cG9ydCBjbGFzcyBFcnJvckJvdW5kYXJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFxuICBFcnJvckJvdW5kYXJ5UHJvcHMsXG4gIEVycm9yQm91bmRhcnlTdGF0ZVxuPiB7XG4gIHB1YmxpYyBzdGF0ZTogRXJyb3JCb3VuZGFyeVN0YXRlID0gSU5JVElBTF9TVEFURTtcblxuICAvLyAgIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IoZXJyb3I6IEVycm9yKSB7XG4gIC8vICAgICAvLyBVcGRhdGUgc3RhdGUgc28gdGhlIG5leHQgcmVuZGVyIHdpbGwgc2hvdyB0aGUgZmFsbGJhY2sgVUkuXG4gIC8vICAgICByZXR1cm4geyBlcnJvciB9O1xuICAvLyAgIH1cblxuICBjb21wb25lbnREaWRDYXRjaChlcnJvcjogRXJyb3IsIGVycm9ySW5mbzogRXJyb3JJbmZvKSB7XG4gICAgY29uc29sZS5sb2coXCJjb21wb25lbmV0IGRpZCBjYXRjaFwiKTtcbiAgICBjb25zdCB7IGJlZm9yZUNhcHR1cmUsIG9uRXJyb3IsIHNob3dEaWFsb2csIGRpYWxvZ09wdGlvbnMgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc29sZS5pbmZvKFwiYm9iYVwiKTtcbiAgICBjb25zb2xlLmVycm9yKFwiVW5jYXVnaHQgZXJyb3I6XCIsIGVycm9yLCBlcnJvckluZm8pO1xuICAgIGNvbnNvbGUubG9nKGRpYWxvZ09wdGlvbnMpO1xuXG4gICAgaWYgKGJlZm9yZUNhcHR1cmUpIHtcbiAgICAgIGJlZm9yZUNhcHR1cmUoZXJyb3IsIGVycm9ySW5mby5jb21wb25lbnRTdGFjayk7XG4gICAgfVxuICAgIGNvbnN0IGV2ZW50SWQgPSBjYXB0dXJlUmVhY3RFcnJvckJvdW5kYXJ5RXJyb3IoXG4gICAgICBlcnJvcixcbiAgICAgIGVycm9ySW5mby5jb21wb25lbnRTdGFja1xuICAgICk7XG4gICAgaWYgKG9uRXJyb3IpIHtcbiAgICAgIG9uRXJyb3IoZXJyb3IsIGVycm9ySW5mby5jb21wb25lbnRTdGFjaywgZXZlbnRJZCk7XG4gICAgfVxuICAgIGlmIChzaG93RGlhbG9nKSB7XG4gICAgICAvLyAgICAgICBzaG93UmVwb3J0RGlhbG9nKHsgLi4uZGlhbG9nT3B0aW9ucywgZXZlbnRJZCB9KTtcbiAgICAgIGNvbnNvbGUubG9nKFwic2hvd1wiKTtcbiAgICB9XG5cbiAgICAvLyBjb21wb25lbnREaWRDYXRjaCBpcyB1c2VkIG92ZXIgZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yXG4gICAgLy8gc28gdGhhdCBjb21wb25lbnRTdGFjayBpcyBhY2Nlc3NpYmxlIHRocm91Z2ggc3RhdGUuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGVycm9yLCBjb21wb25lbnRTdGFjazogZXJyb3JJbmZvLmNvbXBvbmVudFN0YWNrLCBldmVudElkIH0pO1xuICB9XG5cbiAgLy8gICBwdWJsaWMgY29tcG9uZW50RGlkTW91bnQoKTogdm9pZCB7XG4gIC8vICAgICBjb25zdCB7IG9uTW91bnQgfSA9IHRoaXMucHJvcHM7XG4gIC8vICAgICBpZiAob25Nb3VudCkge1xuICAvLyAgICAgICBvbk1vdW50KCk7XG4gIC8vICAgICB9XG4gIC8vICAgfVxuXG4gIC8vICAgcHVibGljIGNvbXBvbmVudFdpbGxVbm1vdW50KCk6IHZvaWQge1xuICAvLyAgICAgY29uc3QgeyBlcnJvciwgY29tcG9uZW50U3RhY2ssIGV2ZW50SWQgfSA9IHRoaXMuc3RhdGU7XG4gIC8vICAgICBjb25zdCB7IG9uVW5tb3VudCB9ID0gdGhpcy5wcm9wcztcbiAgLy8gICAgIGlmIChvblVubW91bnQpIHtcbiAgLy8gICAgICAgb25Vbm1vdW50KGVycm9yLCBjb21wb25lbnRTdGFjaywgZXZlbnRJZCk7XG4gIC8vICAgICB9XG4gIC8vICAgfVxuXG4gIHJlc2V0RXJyb3JCb3VuZGFyeTogKCkgPT4gdm9pZCA9ICgpID0+IHtcbiAgICBjb25zdCB7IG9uUmVzZXQgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBlcnJvciwgY29tcG9uZW50U3RhY2ssIGV2ZW50SWQgfSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKG9uUmVzZXQpIHtcbiAgICAgIG9uUmVzZXQoZXJyb3IsIGNvbXBvbmVudFN0YWNrLCBldmVudElkKTtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZShJTklUSUFMX1NUQVRFKTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5lcnJvcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPG1haW4+XG4gICAgICAgICAgPGgxPlNvcnJ5Li4gdGhlcmUgd2FzIGFuIGVycm9yPC9oMT5cbiAgICAgICAgPC9tYWluPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jaGlsZHJlbjtcbiAgfVxufVxuXG4vKipcbiAqIExvZ3MgcmVhY3QgZXJyb3IgYm91bmRhcnkgZXJyb3JzIHRvIFNlbnRyeS4gSWYgb24gUmVhY3QgdmVyc2lvbiA+PSAxNywgY3JlYXRlcyBzdGFjayB0cmFjZVxuICogZnJvbSBjb21wb25lbnRTdGFjayBwYXJhbSwgb3RoZXJ3aXNlIHJlbGllcyBvbiBlcnJvciBwYXJhbSBmb3Igc3RhY2t0cmFjZS5cbiAqXG4gKiBAcGFyYW0gZXJyb3IgQW4gZXJyb3IgY2FwdHVyZWQgYnkgUmVhY3QgRXJyb3IgQm91bmRhcnlcbiAqIEBwYXJhbSBjb21wb25lbnRTdGFjayBUaGUgY29tcG9uZW50IHN0YWNrdHJhY2VcbiAqL1xuZnVuY3Rpb24gY2FwdHVyZVJlYWN0RXJyb3JCb3VuZGFyeUVycm9yKFxuICBlcnJvcjogRXJyb3IsXG4gIGNvbXBvbmVudFN0YWNrOiBzdHJpbmdcbik6IHN0cmluZyB7XG4gIGNvbnN0IGVycm9yQm91bmRhcnlFcnJvciA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgZXJyb3JCb3VuZGFyeUVycm9yLm5hbWUgPSBgUmVhY3QgRXJyb3JCb3VuZGFyeSAke2Vycm9yQm91bmRhcnlFcnJvci5uYW1lfWA7XG4gIGVycm9yQm91bmRhcnlFcnJvci5zdGFjayA9IGNvbXBvbmVudFN0YWNrO1xuXG4gIGNvbnNvbGUubG9nKGVycm9yQm91bmRhcnlFcnJvcik7XG5cbiAgcmV0dXJuIFwiXCI7XG59XG4iXX0=