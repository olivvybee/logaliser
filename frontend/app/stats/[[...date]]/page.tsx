'use client';

import { use } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import { getCoasterStats } from '@/lib/logaliser-api';

import { Button } from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import { ToggleButton } from '@/components/ToggleButton';

import { Timespan } from '../types';
import { CoasterStats } from '../CoasterStats';

import styles from './page.module.css';
import {
  addMonths,
  endOfMonth,
  formatDate,
  isAfter,
  isFuture,
  isToday,
  subMonths,
} from 'date-fns';

const TIMESPAN_OPTIONS = Object.entries(Timespan).map(([label, value]) => ({
  label,
  value,
}));

const MIN_DATE = '2025-01-01';

const parseDates = (date: string[]) => {
  const now = new Date();

  const [yearStr, monthStr] = date || [now.getFullYear(), now.getMonth() + 1];

  const thisYear = now.getFullYear();
  const year = yearStr ? parseInt(yearStr) : thisYear;

  if (isNaN(year)) {
    return undefined;
  }

  if (!monthStr) {
    return {
      timespan: Timespan.Year,
      startDate: new Date(year, 0, 1),
      endDate: new Date(year, 11, 31),
      nextUrl: `${year + 1}`,
      previousUrl: `${year - 1}`,
    };
  }

  const month = parseInt(monthStr);

  if (isNaN(month)) {
    return undefined;
  }

  const startDate = new Date(year, month - 1);
  const endDate = endOfMonth(startDate);

  const previousMonth = subMonths(startDate, 1);
  const nextMonth = addMonths(startDate, 1);

  return {
    timespan: Timespan.Month,
    startDate,
    endDate,
    nextUrl: formatDate(nextMonth, 'yyyy/MM'),
    previousUrl: formatDate(previousMonth, 'yyyy/MM'),
  };
};

const StatsPage = () => {
  const params = useParams();
  const router = useRouter();

  const dates = parseDates(params.date as string[]);
  if (!dates) {
    return notFound();
  }

  const { timespan, startDate, endDate, nextUrl, previousUrl } = dates;

  const dateLabel =
    timespan === Timespan.Month
      ? formatDate(startDate, 'MMMM yyyy')
      : startDate.getFullYear();

  const dateRangeIncludesNow = isFuture(endDate) || isToday(endDate);
  const canGoBackwards = isAfter(startDate, MIN_DATE);

  const setTimespan = (newTimespan: Timespan) => {
    const thisYear = new Date().getFullYear().toString();
    const [year] = params.date || [thisYear];

    if (newTimespan === Timespan.Year) {
      router.replace(`/stats/${year}`);
    }

    if (newTimespan === Timespan.Month) {
      if (year === thisYear) {
        const thisMonth = formatDate(new Date(), 'MM');
        router.replace(`/stats/${thisYear}/${thisMonth}`);
      } else {
        router.replace(`/stats/${year}/01`);
      }
    }
  };

  const goBackwards = () => {
    router.replace(`/stats/${previousUrl}`);
  };

  const goForwards = () => {
    router.replace(`/stats/${nextUrl}`);
  };

  const reset = () => {
    const now = new Date();
    const url =
      timespan === Timespan.Month
        ? formatDate(now, 'yyyy/MM')
        : formatDate(now, 'yyyy');

    router.replace(`/stats/${url}`);
  };

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
          <Button disabled={!canGoBackwards} onClick={goBackwards}>
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
