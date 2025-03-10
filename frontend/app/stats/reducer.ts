import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subWeeks,
  subMonths,
  subYears,
  addWeeks,
  addMonths,
  addYears,
} from 'date-fns';
import { Timespan } from './types';

const getBaseDateRange = (timespan: Timespan) => {
  const now = new Date();

  switch (timespan) {
    case Timespan.Week:
      return {
        startDate: startOfWeek(now),
        endDate: endOfWeek(now),
      };

    case Timespan.Month:
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
      };

    case Timespan.Year:
      return {
        startDate: startOfYear(now),
        endDate: endOfYear(now),
      };
  }
};

export enum ActionType {
  GoBackwards = 'backwards',
  GoForwards = 'forwards',
  SetTimespan = 'set-timespan',
}

interface BaseAction {
  type: ActionType;
  timespan?: Timespan;
}

interface MoveAction extends BaseAction {
  type: ActionType.GoBackwards | ActionType.GoForwards;
  timespan?: never;
}

interface SetTimespanAction extends BaseAction {
  type: ActionType.SetTimespan;
  timespan: Timespan;
}

export type Action = MoveAction | SetTimespanAction;

export interface State {
  timespan: Timespan;
  startDate: Date;
  endDate: Date;
}

export const initialState: State = {
  timespan: Timespan.Week,
  ...getBaseDateRange(Timespan.Week),
};

export const reducer = (state: State, action: Action) => {
  if (action.type === ActionType.SetTimespan) {
    const { startDate, endDate } = getBaseDateRange(action.timespan);
    return {
      timespan: action.timespan,
      startDate,
      endDate,
    };
  }

  if (action.type === ActionType.GoBackwards) {
    switch (state.timespan) {
      case Timespan.Week:
        return {
          ...state,
          startDate: subWeeks(state.startDate, 1),
          endDate: subWeeks(state.endDate, 1),
        };

      case Timespan.Month:
        return {
          ...state,
          startDate: subMonths(state.startDate, 1),
          endDate: subMonths(state.endDate, 1),
        };

      case Timespan.Year:
        return {
          ...state,
          startDate: subYears(state.startDate, 1),
          endDate: subYears(state.endDate, 1),
        };
    }
  }

  if (action.type === ActionType.GoForwards) {
    switch (state.timespan) {
      case Timespan.Week:
        return {
          ...state,
          startDate: addWeeks(state.startDate, 1),
          endDate: addWeeks(state.endDate, 1),
        };

      case Timespan.Month:
        return {
          ...state,
          startDate: addMonths(state.startDate, 1),
          endDate: addMonths(state.endDate, 1),
        };

      case Timespan.Year:
        return {
          ...state,
          startDate: addYears(state.startDate, 1),
          endDate: addYears(state.endDate, 1),
        };
    }
  }

  return state;
};
