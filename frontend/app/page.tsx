'use client';

import { format, isToday, isYesterday } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

import { getRecentActivities } from '@/lib/logaliser-api';
import { ActivityList } from '@/components/ActivityList';
import { Spinner } from '@/components/Spinner';

import styles from './page.module.css';

const Homepage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: getRecentActivities,
  });

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
          {Object.entries(data).map(([date, activities]) => {
            const dateHeading = isToday(date)
              ? 'Today'
              : isYesterday(date)
              ? 'Yesterday'
              : format(date, 'EEEE');

            return (
              <div key={date}>
                <h2>{dateHeading}</h2>
                <ActivityList activities={activities} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Homepage;
