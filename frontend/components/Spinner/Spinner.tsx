import { IconLoader2 } from '@tabler/icons-react';

import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: number;
}

export const Spinner = ({ size }: SpinnerProps) => (
  <IconLoader2 size={size} className={styles.spinner} />
);
