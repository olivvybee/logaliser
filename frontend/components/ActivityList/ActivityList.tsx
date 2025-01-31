import { Activity } from '@/lib/logaliser-api/types';

import { getDetails, getIcon } from './utils';

import styles from './ActivityList.module.css';
import { RelativeTimestamp } from '../RelativeTimestamp';

interface ActivityListProps {
  activities: Activity[];
}

export const ActivityList = ({ activities }: ActivityListProps) => {
  return (
    <ul className={styles.activityList}>
      {activities.map((activity) => {
        const Icon = getIcon(activity.type);
        const details = getDetails(activity);

        return (
          <li key={activity.id} className={styles.activity}>
            <Icon />
            <div className={styles.activityDetails}>
              <span className={styles.title}>{details.title}</span>
              {details.metadata && (
                <span className={styles.metadata}>{details.metadata}</span>
              )}
              <span className={styles.timestamp}>
                <RelativeTimestamp date={activity.endDate} />
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
