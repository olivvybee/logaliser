import { ActivityType } from '@logaliser/api';
import { CoasterCard } from './cards/CoasterCard';
import { CardComponentProps } from './types';
import { UnknownActivityCard } from './cards/UnknownActivityCard/UnknownActivityCard';

export const getCardComponent = (
  activityType: ActivityType
): React.ComponentType<CardComponentProps> => {
  switch (activityType) {
    case ActivityType.Coaster:
      return CoasterCard;

    default:
      return UnknownActivityCard;
  }
};
