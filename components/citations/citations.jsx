import styles from "./citations.module.css";

export default function Citations({ citationsList }) {
  const trimmedCitationsList = citationsList.slice(0, 2);

  return (
    <ul className={styles.container}>
      {trimmedCitationsList.map((citation, idx) => (
        <li key={idx}>
          <a href={citation} target="_blank" rel="noopener noreferrer">
            {citation}
          </a>
        </li>
      ))}
    </ul>
  );
}
