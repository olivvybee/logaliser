import { IconQuestionMark } from '@tabler/icons-react';
import { CardComponentProps } from '../../types';
import { ActivityCard } from '../ActivityCard';

export const UnknownActivityCard = ({ activity }: CardComponentProps) => (
  <ActivityCard
    icon={IconQuestionMark}
    title="Unknown activity type"
    date={activity.timestamp}
    renderActions={() => null}
    renderDetails={() => null}
  />
);
