import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IconCopy, IconRollercoasterFilled } from '@tabler/icons-react';

import { CoasterActivity } from '@logaliser/api';
import { duplicateCoasterActivity } from '@/lib/logaliser-api';

import { Button } from '@/components/Button';

import { CardComponentProps } from '../../types';
import { ActivityCard } from '../ActivityCard';

import styles from './CoasterCard.module.css';

export const CoasterCard = ({
  activity: untypedActivity,
}: CardComponentProps) => {
  const activity = untypedActivity as CoasterActivity;

  const queryClient = useQueryClient();

  const { mutate: duplicateActivity, isPending: duplicatePending } =
    useMutation({
      mutationFn: () => duplicateCoasterActivity(activity),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['recentActivities'] });
      },
    });

  return (
    <ActivityCard
      title={activity.coaster.name}
      icon={IconRollercoasterFilled}
      date={activity.endDate}
      renderActions={() => (
        <Button
          theme="ghost"
          iconOnly={true}
          onClick={() => duplicateActivity()}
          loading={duplicatePending}>
          <IconCopy />
        </Button>
      )}
      renderDetails={() => (
        <span className={styles.parkName}>{activity.coaster.park.name}</span>
      )}
    />
  );
};
