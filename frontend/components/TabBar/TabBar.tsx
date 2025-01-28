import Link from 'next/link';
import classNames from 'classnames';
import { IconPlus, IconHistory, IconChartBar } from '@tabler/icons-react';

import styles from './TabBar.module.css';

export const TabBar = () => {
  return (
    <div className={styles.tabBar}>
      <div className={styles.tabs}>
        <Link className={classNames(styles.tab, styles.leftTab)} href="/">
          <IconHistory />
          <span>Recent</span>
        </Link>
        <Link
          className={classNames(styles.tab, styles.logaliseButton)}
          href="/logalise/coaster">
          <IconPlus size={48} stroke={3} />
        </Link>
        <span className={classNames(styles.tab, styles.rightTab)}>
          <IconChartBar />
          <span>Stats</span>
        </span>
      </div>
    </div>
  );
};
