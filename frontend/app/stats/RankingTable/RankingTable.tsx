import styles from './RankingTable.module.css';

export interface RankingTableEntry {
  label: string;
  value: number;
}

export interface RankingTableProps {
  title: string;
  labelColumnName?: string;
  valueColumnName?: string;
  entries: RankingTableEntry[];
}

export const RankingTable = ({
  title,
  labelColumnName,
  valueColumnName,
  entries,
}: RankingTableProps) => (
  <div className={styles.wrapper}>
    <span className={styles.title}>{title}</span>

    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.rankCell}>#</th>
          <th className={styles.labelCell}>{labelColumnName}</th>
          <th className={styles.valueCell}>{valueColumnName}</th>
        </tr>
      </thead>
      <tbody>
        {entries
          .toSorted((a, b) => b.value - a.value)
          .map((entry, index) => (
            <tr key={entry.label}>
              <td className={styles.rankCell}>{index + 1}</td>
              <td className={styles.labelCell}>{entry.label}</td>
              <td className={styles.valueCell}>{entry.value}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);
