import { ReactNode } from 'react';

import styles from './StatBox.module.css';

export interface StatProps {
  label: ReactNode;
  value: ReactNode;
  unit?: string;
  extraInfo?: ReactNode;
}

export const Stat = ({ label, value, unit, extraInfo }: StatProps) => (
  <div className={styles.statBox}>
    <div className={styles.label}>{label}</div>

    <div className={styles.valueWrapper}>
      <div className={styles.value}>
        <span>
          {value}
          {unit && <span className={styles.unit}> {unit}</span>}
        </span>
      </div>
      <div className={styles.extraInfo}>{extraInfo}</div>
    </div>
  </div>
);
