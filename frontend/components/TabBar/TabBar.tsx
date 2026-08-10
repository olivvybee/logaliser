import Link from 'next/link';
import classNames from 'classnames';
import {
  IconPlus,
  IconHistory,
  IconChartBar,
  IconSettings,
  IconStack2,
} from '@tabler/icons-react';

import styles from './TabBar.module.css';

export const TabBar = () => {
  return (
    <div className={styles.tabBar}>
      <div className={styles.tabs}>
        <Link className={styles.tab} href="/">
          <IconHistory />
          <span>History</span>
        </Link>
        <Link className={classNames(styles.tab, styles.leftTab)} href="/stats">
          <IconChartBar />
          <span>Stats</span>
        </Link>
        <Link
          className={classNames(styles.tab, styles.logaliseButton)}
          href="/logalise">
          <IconPlus size={48} stroke={3} />
        </Link>
        <Link
          className={classNames(styles.tab, styles.rightTab)}
          href="/entities">
          <IconStack2 />
          <span>Entities</span>
        </Link>
        <Link className={styles.tab} href="/settings">
          <IconSettings />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
};
