"use client";
import Message from "../message/Message";

import styles from "./messageList.module.css";

export default function MessageList(props) {
  const { content } = props;
  return (
    <div className={styles.container}>
      {content.map((message, idx) => {
        return message.role === "user" ? (
          <Message type="user" content={message.content} key={idx} />
        ) : (
          <Message content={message.content} key={idx} />
        );
      })}
    </div>
  );
}
