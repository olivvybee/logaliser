'use client';

import { AnyActivity, getActivityType } from '@logaliser/api';

import { getCardComponent } from './utils';

import styles from './ActivityList.module.css';

interface ActivityListProps {
  activities: AnyActivity[];
}

export const ActivityList = ({ activities }: ActivityListProps) => (
  <ul className={styles.activityList}>
    {activities.map((activity) => {
      const type = getActivityType(activity);
      const CardComponent = getCardComponent(type);

      return (
        <li key={activity.id}>
          <CardComponent activity={activity} />
        </li>
      );
    })}
  </ul>
);
