import { ReactNode } from 'react';

import styles from './Stat.module.css';

export interface StatProps {
  label: ReactNode;
  value: ReactNode;
  extraInfo?: ReactNode;
}

export const Stat = ({ label, value, extraInfo }: StatProps) => (
  <div className={styles.stat}>
    <div className={styles.label}>{label}</div>

    <div className={styles.valueWrapper}>
      <div className={styles.value}>{value}</div>
      <div className={styles.extraInfo}>{extraInfo}</div>
    </div>
  </div>
);
