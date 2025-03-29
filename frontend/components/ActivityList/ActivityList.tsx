'use client';

import { CoasterActivity } from '@logaliser/api';

import { getCardComponent } from './utils';

import styles from './ActivityList.module.css';

interface ActivityListProps {
  activities: CoasterActivity[];
}

export const ActivityList = ({ activities }: ActivityListProps) => (
  <ul className={styles.activityList}>
    {activities.map((activity) => {
      const CardComponent = getCardComponent(activity.type);

      return (
        <li key={activity.id}>
          <CardComponent activity={activity} />
        </li>
      );
    })}
  </ul>
);
