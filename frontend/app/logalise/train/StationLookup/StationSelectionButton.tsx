import { Station } from '@logaliser/api';
import { Button } from '@/components/Button';

import styles from './StationSelectionButton.module.css';

interface StationSelectionButtonProps {
  station: Station;
  onClick: () => void;
}

export const StationSelectionButton = ({
  station,
  onClick,
}: StationSelectionButtonProps) => (
  <Button
    type="button"
    theme="secondary"
    className={styles.stationSelectionButton}
    onClick={onClick}>
    <span className={styles.stationName}>{station.name}</span>
    {station.code && <span className={styles.stationCode}>{station.code}</span>}
  </Button>
);
