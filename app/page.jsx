"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Input from "@/components/input/Input";
import MessageList from "@/components/messageList/messageList";

export default function Home() {
  const [thread, setThread] = useState([
    {
      ai: "Hi there, I am your Azure Open AI Documentation Copilot, ask me anything about the service!",
    },
    {
      user: "Awesome, what are the models suppored? and where? and Awesome, what are the models suppored?. Awesome, what are the models suppored?Awesome, what are the models suppored?",
    },
    {
      ai: "I support  bunch of models such as GPT4 and  GPT4-Turbo",
    },
    { user: "what region are they available in?" },
    {
      ai: "Region avaialabitliy will vary, waht model in particular?",
    },
    {
      user: "how about GPT4 1106?",
    },
    {
      ai: "we have it north central",
    },
  ]);

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Azure Open AI Documentation Copilot - Questions already
          answered:&nbsp;
          <code className={styles.code}>100</code>
        </p>
        <div>
          <a href="mailto:romanmullier@microsoft.com?subject=Feedback on AOAI Documentation Copilot">
            Feedback appreciated
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <MessageList content={thread} />
      </div>

      <div className={styles.input}>
        <Input />
      </div>
    </main>
  );
}
