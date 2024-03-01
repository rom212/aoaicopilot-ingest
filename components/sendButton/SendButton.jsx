"use client";

import { useFormStatus } from "react-dom";

import { Discuss } from "react-loader-spinner";

import styles from "./SendButton.module.css";

export default function Sendbutton() {
  const { pending } = useFormStatus();

  return pending ? (
    <Discuss
      visible={true}
      height="40"
      width="40"
      ariaLabel="discuss-loading"
      wrapperStyle={{}}
      wrapperClass="discuss-wrapper"
      color="#fff"
      backgroundColor="#F4442E"
    />
  ) : (
    <button className={styles.container} type="submit" disabled={pending}>
      &gt;
    </button>
  );
}
