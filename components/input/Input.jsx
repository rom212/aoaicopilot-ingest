import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import Sendbutton from "../sendButton/SendButton";
import styles from "./Input.module.css";

import { sendNewMessage } from "@/actions/actions";
import InputBar from "../inputBar/InputBar";

export default function Input(props) {
  const { onNewMessage, thread } = props;
  const inputRef = useRef();
  const sendNewMessageWithHistory = sendNewMessage.bind(null, thread);
  const [state, formAction] = useFormState(sendNewMessageWithHistory, "");

  useEffect(() => {
    if (state.status == "success") {
      inputRef.current.value = "";
      onNewMessage({ role: "assistant", content: state.response });
    }
  }, [state]);

  const handleSubmit = () => {
    onNewMessage({ role: "user", content: inputRef.current.value });
  };

  return (
    <form
      className={styles.container}
      action={formAction}
      onSubmit={handleSubmit}
    >
      {/* <input
        type="text"
        id="inputQuestion"
        name="inputQuestion"
        ref={inputRef}
        // disabled
      /> */}
      <InputBar test="fdfdG" ref={inputRef} />
      <Sendbutton />
    </form>
  );
}
