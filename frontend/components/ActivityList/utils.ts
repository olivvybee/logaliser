import { ActivityType } from '@logaliser/api';
import { CoasterCard } from './cards/CoasterCard';
import { CardComponentProps } from './types';
import { UnknownActivityCard } from './cards/UnknownActivityCard/UnknownActivityCard';
import { TrainCard } from './cards/TrainCard';

export const getCardComponent = (
  activityType: ActivityType
): React.ComponentType<CardComponentProps> => {
  switch (activityType) {
    case ActivityType.Coaster:
      return CoasterCard;

    case ActivityType.Train:
      return TrainCard;

    default:
      return UnknownActivityCard;
  }
};
