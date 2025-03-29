import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  IconBarrierBlock,
  IconCopy,
  IconRollercoasterFilled,
  IconSparkles,
  IconTool,
} from '@tabler/icons-react';

import { CoasterActivity } from '@logaliser/api';
import { duplicateCoasterActivity } from '@/lib/logaliser-api';

import { Button } from '@/components/Button';

import { CardComponentProps } from '../../types';
import { ActivityCard } from '../ActivityCard';

import styles from './CoasterCard.module.css';
import classNames from 'classnames';

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

  const tags = [
    activity.metadata.firstRide
      ? { icon: IconSparkles, text: 'First ride', colour: styles.positive }
      : undefined,
    activity.metadata.inShowExit
      ? {
          icon: IconBarrierBlock,
          text: 'In-show exit',
          colour: styles.negative,
        }
      : undefined,
  ].filter((tag) => tag !== undefined);

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
        <>
          <span className={styles.parkName}>{activity.coaster.park.name}</span>
          {!!tags.length && (
            <div className={styles.tags}>
              {tags.map((tag) => (
                <span
                  className={classNames(styles.tag, tag.colour)}
                  key={tag.text}>
                  <tag.icon size={16} /> {tag.text}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    />
  );
};
