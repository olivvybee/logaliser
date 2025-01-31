import { ActivityList } from '@/components/ActivityList';
import { getRecentActivities } from '@/lib/logaliser-api/server/activities';

import styles from './page.module.css';
import { format, isToday, isYesterday } from 'date-fns';

const Homepage = async () => {
  const recentActivities = await getRecentActivities();

  return (
    <>
      <h1>Recently logalised</h1>

      <div className={styles.recentlyLogalised}>
        {Object.entries(recentActivities).map(([date, activities]) => {
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
    </>
  );
};

export default Homepage;
