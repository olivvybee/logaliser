import { Activity } from '@prisma/client';
import { formatDate } from 'date-fns';

export const getDay = (activity: Activity) =>
  formatDate(activity.timestamp, 'yyyy-MM-dd');

export const getMonth = (activity: Activity) =>
  formatDate(activity.timestamp, 'yyyy-MM');
