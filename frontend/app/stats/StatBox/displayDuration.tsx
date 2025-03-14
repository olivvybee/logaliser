import { secondsToDuration } from '../utils/convertDuration';

import statStyles from './StatBox.module.css';

export const displayDuration = (sec: number) => {
  const { hours, minutes, seconds } = secondsToDuration(sec);

  return (
    <span>
      {hours !== undefined && (
        <>
          <span className={statStyles.value}>{hours}</span>
          <span className={statStyles.unit}>h </span>
        </>
      )}

      {minutes !== undefined && (
        <>
          <span className={statStyles.value}>{minutes}</span>
          <span className={statStyles.unit}>m </span>
        </>
      )}

      {seconds !== undefined && (
        <>
          <span className={statStyles.value}>{seconds}</span>
          <span className={statStyles.unit}>s</span>
        </>
      )}
    </span>
  );
};
