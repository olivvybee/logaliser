'use client';

import { Activity } from '@/lib/logaliser-api/types';
import { IconCopy } from '@tabler/icons-react';

import { RelativeTimestamp } from '../RelativeTimestamp';
import { Button } from '../Button';

import { getDetails, getIcon } from './utils';

import styles from './ActivityList.module.css';
import { useMutation } from '@tanstack/react-query';
import { duplicateCoasterActivity } from '@/lib/logaliser-api/client/coasters';

interface ActivityListProps {
  activities: Activity[];
}

export const ActivityList = ({ activities }: ActivityListProps) => {
  const {
    mutate: duplicateActivity,
    isPending: duplicatePending,
    error: duplicateError,
  } = useMutation({
    mutationFn: (activity: Activity) => duplicateCoasterActivity(activity),
    onSuccess: () => {
      window.location.reload();
    },
  });

  return (
    <ul className={styles.activityList}>
      {activities.map((activity) => {
        const Icon = getIcon(activity.type);
        const details = getDetails(activity);

        return (
          <li key={activity.id} className={styles.activity}>
            <div className={styles.display}>
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
            </div>

            <div className={styles.actions}>
              <Button
                theme="ghost"
                iconOnly={true}
                onClick={() => duplicateActivity(activity)}
                loading={duplicatePending}>
                <IconCopy />
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
