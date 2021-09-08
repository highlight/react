import styles from "./ReportDialog.module.css";
import React, { useEffect, useRef, useState } from "react";

export interface ReportDialogOptions {
  user?: {
    email?: string;
    name?: string;
  };
  title?: string;
  subtitle?: string;
  subtitle2?: string;
  labelName?: string;
  labelEmail?: string;
  labelComments?: string;
  labelClose?: string;
  labelSubmit?: string;
  successMessage?: string;
}

type ReportDialogProps = ReportDialogOptions & {
  onCloseHandler: () => void;
};

const ReportDialog = ({
  labelClose = "Close",
  labelComments = "What happened?",
  labelEmail = "Email",
  labelName = "Name",
  labelSubmit = "Submit",
  subtitle2 = "If you’d like to help, tell us what happened below.",
  subtitle = "Our team has been notified",
  successMessage = "Your feedback has been sent. Thank you!",
  title = "It looks like we’re having issues.",
  user,
  onCloseHandler,
}: ReportDialogProps) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [verbatim, setVerbatim] = useState("");

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const userInput = {
      name,
      email,
      verbatim,
    };

    console.log(userInput);

    onCloseHandler();
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          <h2 className={styles.subtitle}>
            {subtitle} {subtitle2}
          </h2>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            {labelName}
            <input
              type="text"
              value={name}
              name="name"
              autoFocus
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </label>

          <label>
            {labelEmail}
            <input
              type="email"
              value={email}
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </label>

          <label>
            {labelComments}
            <textarea
              value={verbatim}
              placeholder="I typed in a name then clicked the button"
              name="verbatim"
              rows={3}
              onChange={(e) => {
                setVerbatim(e.target.value);
              }}
            ></textarea>
          </label>

          <div className={styles.formFooter}>
            <div className={styles.formActionsContainer}>
              <button type="submit" className={styles.button}>
                {labelSubmit}
              </button>
              <button
                className={`${styles.button} ${styles.closeButton}`}
                onClick={onCloseHandler}
                type="button"
              >
                {labelClose}
              </button>
            </div>
            <div className={styles.ad}>
              <p>
                Crash reports powered by{" "}
                <a href="https://highlight.run" target="_blank">
                  Highlight
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ReportDialog;
