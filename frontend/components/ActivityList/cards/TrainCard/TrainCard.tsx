import { format } from 'date-fns';
import Link from 'next/link';
import { IconCheck, IconFlagCheck, IconTrack } from '@tabler/icons-react';
import { TrainActivity } from '@logaliser/api';
import { CardComponentProps } from '../../types';
import { ActivityCard } from '../ActivityCard';
import buttonStyles from '@/components/Button/Button.module.css';
import classNames from 'classnames';

export const TrainCard = ({
  activity: untypedActivity,
}: CardComponentProps) => {
  const activity = untypedActivity as TrainActivity;

  const title = activity.trainActivity.destination?.name
    ? `${activity.trainActivity.origin.name} → ${activity.trainActivity.destination.name}`
    : `Departed from ${activity.trainActivity.origin.name}`;

  const date =
    activity.trainActivity.arrivalTime || activity.trainActivity.departureTime;

  const departureTime = format(activity.trainActivity.departureTime, 'HH:mm');
  const arrivalTime = activity.trainActivity.arrivalTime
    ? format(activity.trainActivity.arrivalTime, 'HH:mm')
    : undefined;

  const timeDetails = arrivalTime
    ? `${departureTime}–${arrivalTime}`
    : undefined;

  const isIncomplete = !activity.trainActivity.arrivalTime;

  return (
    <ActivityCard
      title={title}
      icon={IconTrack}
      date={date}
      renderActions={() =>
        isIncomplete ? (
          <Link
            href={`/logalise/train/complete/${activity.trainActivity.id}`}
            className={classNames(buttonStyles.button, buttonStyles.ghost)}>
            <IconFlagCheck />
          </Link>
        ) : null
      }
      renderDetails={() => <span>{timeDetails}</span>}
    />
  );
};
