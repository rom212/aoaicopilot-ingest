"use client";
import React, { useEffect, useRef } from "react";
import Message from "../message/Message";

import styles from "./messageList.module.css";

export default function MessageList(props) {
  const { content } = props;

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [content]);

  return (
    <div className={styles.container}>
      {content.map((message, idx) => {
        return message.role === "user" ? (
          <Message type="user" content={message.content} key={idx} />
        ) : (
          <Message content={message.content} key={idx} />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
