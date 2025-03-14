import statStyles from '../Stat/Stat.module.css';

export const secondsToDuration = (seconds: number) => {
  if (seconds < 60) {
    return { seconds };
  }

  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds - minutes * 60;
    return { minutes, seconds: sec };
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds - hours * 3600) / 60);
  return { hours, minutes };
};
