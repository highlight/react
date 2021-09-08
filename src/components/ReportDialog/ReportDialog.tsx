import React from "react";

export interface ReportDialogProps {
  eventId?: string;
  user?: {
    email?: string;
    name?: string;
  };
  lang?: string;
  title?: string;
  subtitle?: string;
  subtitle2?: string;
  labelName?: string;
  labelEmail?: string;
  labelComments?: string;
  labelClose?: string;
  labelSubmit?: string;
  errorGeneric?: string;
  errorFormEntry?: string;
  successMessage?: string;
  /** Callback after reportDialog showed up */
  onLoad?(): void;
}

const ReportDialog = (props: ReportDialogProps) => {
  console.log(props);
  return <div></div>;
};

export default ReportDialog;
