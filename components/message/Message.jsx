import classNames from "classnames";

import Ninja from "@/icons/Ninja";
import User from "@/icons/User";

import styles from "./Message.module.css";
import Citations from "../citations/citations";

export default function Message(props) {
  const { type, content, citations } = props;

  console.log("CITATINS: ", citations);

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
        <p
          dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br/>") }}
        />
        {citations?.length > 0 && <Citations citationsList={citations} />}
      </div>
    </div>
  );
}
