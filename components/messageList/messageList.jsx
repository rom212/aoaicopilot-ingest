"use client";
import Message from "../message/Message";

import styles from "./messageList.module.css";

export default function MessageList(props) {
  const { content } = props;
  return (
    <div className={styles.container}>
      {content.map((message) => {
        return message.user ? (
          <Message type="user" content={message.user} />
        ) : (
          <Message content={message.ai} />
        );
      })}
    </div>
  );
}
