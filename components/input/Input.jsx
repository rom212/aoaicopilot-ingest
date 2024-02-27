import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import Sendbutton from "../sendButton/SendButton";
import styles from "./Input.module.css";

import { sendNewMessage } from "@/actions/actions";

export default function Input() {
  const inputRef = useRef();
  const [state, formAction] = useFormState(sendNewMessage, "");

  useEffect(() => {
    if (state.message == "success") {
      inputRef.current.value = "";
    }
  }, [state]);

  return (
    <form className={styles.container} action={formAction}>
      <input
        type="text"
        id="inputQuestion"
        name="inputQuestion"
        ref={inputRef}
      />
      <Sendbutton />
    </form>
  );
}
