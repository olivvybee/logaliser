import { RelativeTimestamp } from '@/components/RelativeTimestamp';
import styles from './ActivityCard.module.css';

export interface ActivityCardProps {
  icon: React.ComponentType;
  title: string;
  date: string;
  renderDetails: () => React.ReactNode;
  renderActions: () => React.ReactNode;
}

export const ActivityCard = ({
  icon: Icon,
  title,
  date,
  renderDetails,
  renderActions,
}: ActivityCardProps) => {
  return (
    <div className={styles.activityCard}>
      <div className={styles.content}>
        <div className={styles.wrapper}>
          <Icon />

          <div className={styles.data}>
            <span className={styles.title}>{title}</span>

            {renderDetails()}

            <span className={styles.timestamp}>
              <RelativeTimestamp date={date} />
            </span>
          </div>
        </div>

        {renderActions()}
      </div>
    </div>
  );
};
