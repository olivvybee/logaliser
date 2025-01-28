import { getRecentActivities } from '@/lib/logaliser-api/server/activities';

const Homepage = async () => {
  const recentActivities = await getRecentActivities();

  return (
    <div>
      <h1>Recently logalised</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(recentActivities).map(([date, activities]) => (
          <div key={date}>
            <h2>{date}</h2>
            <ul>
              {activities.map((activity) => (
                <li key={activity.id}>
                  {activity.endDate.slice(11, 16)} - {activity.coaster.name} (
                  {activity.coaster.park.name})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
