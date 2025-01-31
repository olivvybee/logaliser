'use client';

import { format, formatDistanceToNow, isToday } from 'date-fns';
import { useEffect, useState } from 'react';

interface RelativeTimestampProps {
  date: Date | string;
}

const formatTimestamp = (date: Date | string) => {
  if (isToday(date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return format(date, 'HH:mm');
};

export const RelativeTimestamp = ({ date }: RelativeTimestampProps) => {
  const [timestamp, setTimestamp] = useState(formatTimestamp(date));

  useEffect(() => {
    if (!isToday(date)) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimestamp(formatTimestamp(date));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [date]);

  return timestamp;
};
