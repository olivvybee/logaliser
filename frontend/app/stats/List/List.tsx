import styles from './List.module.css';

export interface ListProps {
  title: string;
  entries: string[];
}

export const List = ({ title, entries }: ListProps) => (
  <div className={styles.wrapper}>
    <span className={styles.title}>{title}</span>
    <ul className={styles.list}>
      {entries.map((entry) => (
        <li className={styles.entry} key={entry}>
          {entry}
        </li>
      ))}
    </ul>
  </div>
);
