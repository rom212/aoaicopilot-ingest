"use client";

import { useFormStatus } from "react-dom";

import { Audio, CirclesWithBar, Discuss, Comment } from "react-loader-spinner";

import styles from "./SendButton.module.css";

export default function Sendbutton() {
  const { pending } = useFormStatus();

  return pending ? (
    <Comment
      visible={true}
      height="40"
      width="40"
      ariaLabel="comment-loading"
      wrapperStyle={{}}
      wrapperClass="comment-wrapper"
      color="#fff"
      backgroundColor="#6593b4"
    />
  ) : (
    <button className={styles.container} type="submit" disabled={pending}>
      &gt;
    </button>
  );
}
