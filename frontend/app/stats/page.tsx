'use client';

import { useReducer } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { formatDate, isFuture, isToday } from 'date-fns';

import { Spinner } from '@/components/Spinner';
import { ToggleButton } from '@/components/ToggleButton';
import { Button } from '@/components/Button';
import { getCoasterStats } from '@/lib/logaliser-api';

import { Timespan } from './types';
import { ActionType, initialState, reducer } from './reducer';
import { CoasterStats } from './CoasterStats';

import styles from './page.module.css';

const TIMESPAN_OPTIONS = Object.entries(Timespan).map(([label, value]) => ({
  label,
  value,
}));

const StatsPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { timespan, startDate, endDate } = state;

  const dateRangeIncludesNow = isFuture(endDate) || isToday(endDate);

  const setTimespan = (timespan: Timespan) => {
    dispatch({ type: ActionType.SetTimespan, timespan });
  };

  const goBackwards = () => {
    dispatch({ type: ActionType.GoBackwards });
  };

  const goForwards = () => {
    dispatch({ type: ActionType.GoForwards });
  };

  const reset = () => {
    dispatch({ type: ActionType.Reset });
  };

  const dateLabel =
    timespan === Timespan.Week
      ? `${formatDate(startDate, 'dd MMM yyyy')} - ${formatDate(
          endDate,
          'dd MMM yyyy'
        )}`
      : timespan === Timespan.Month
      ? formatDate(startDate, 'MMMM yyyy')
      : startDate.getFullYear();

  const { data, isLoading } = useQuery({
    queryKey: ['coaster-stats', startDate, endDate],
    queryFn: () => getCoasterStats(startDate, endDate),
  });

  return (
    <>
      <h1>Stats</h1>

      <div className={styles.dateChooser}>
        <ToggleButton
          name="timespan"
          options={TIMESPAN_OPTIONS}
          value={timespan}
          onChange={setTimespan}
        />

        <div className={styles.dateNavigator}>
          <Button onClick={goBackwards}>
            <IconChevronLeft />
          </Button>
          <span className={styles.selectedRange} onClick={reset}>
            {dateLabel}
          </span>
          <Button disabled={dateRangeIncludesNow} onClick={goForwards}>
            <IconChevronRight />
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className={styles.spinnerContainer}>
          <Spinner size={48} />
        </div>
      )}

      {!!data && <CoasterStats stats={data} timespan={timespan} />}
    </>
  );
};

export default StatsPage;
