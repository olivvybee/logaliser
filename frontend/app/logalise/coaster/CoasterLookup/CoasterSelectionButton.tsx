import { CoasterWithPark } from '@logaliser/api';
import { Button } from '@/components/Button';

import styles from './CoasterSelectionButton.module.css';

interface CoasterSelectionButtonProps {
  coaster: CoasterWithPark;
  onClick: () => void;
}

export const CoasterSelectionButton = ({
  coaster,
  onClick,
}: CoasterSelectionButtonProps) => (
  <Button
    type="button"
    theme="secondary"
    className={styles.coasterSelectionButton}
    onClick={onClick}>
    <span className={styles.coasterName}>{coaster.name}</span>
    <span className={styles.parkName}>{coaster.park.name}</span>
  </Button>
);
