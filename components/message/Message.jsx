import classNames from "classnames";

import Ninja from "@/icons/Ninja";
import User from "@/icons/User";

import styles from "./Message.module.css";

export default function Message(props) {
  const { type, content } = props;

  return (
    <div
      className={classNames(styles.container, {
        [styles.user]: type == "user",
      })}
    >
      <div className={styles.logo}>{type == "user" ? <User /> : <Ninja />}</div>
      <div
        className={classNames(styles.message, {
          [styles.user_message]: type == "user",
        })}
      >
        <p>{content}</p>
      </div>
      {/* <div>BLANK GOES HERE</div> */}
    </div>
  );
}
