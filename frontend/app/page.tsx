'use client';

import { format, isToday, isYesterday } from 'date-fns';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import _groupBy from 'lodash/groupBy';

import { getAllActivities, getRecentActivities } from '@/lib/logaliser-api';
import { ActivityList } from '@/components/ActivityList';
import { Spinner } from '@/components/Spinner';

import styles from './page.module.css';
import { Button } from '@/components/Button';

const Homepage = () => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['allActivities'],
      queryFn: ({ pageParam }) => getAllActivities(pageParam),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const activities = data?.pages.flatMap((page) => page.activities) || [];
  const activitiesByDate = _groupBy(activities, (activity) =>
    activity.timestamp.slice(0, 10)
  );

  return (
    <>
      <h1>Recently logalised</h1>

      {isLoading && (
        <div className={styles.spinnerContainer}>
          <Spinner size={48} />
        </div>
      )}

      {data && (
        <div className={styles.recentlyLogalised}>
          {Object.entries(activitiesByDate).map(([date, activities]) => {
            const dateHeading = isToday(date)
              ? 'Today'
              : isYesterday(date)
                ? 'Yesterday'
                : format(date, 'd LLL yyyy');

            return (
              <div key={date}>
                <h2>{dateHeading}</h2>
                <ActivityList activities={activities} />
              </div>
            );
          })}

          {hasNextPage && <Button onClick={fetchNextPage}>Load more</Button>}
        </div>
      )}
    </>
  );
};

export default Homepage;
