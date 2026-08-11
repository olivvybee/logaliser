import classNames from 'classnames';

import { getTraewellingAuthStatus } from '@/lib/logaliser-api';
import buttonStyles from '@/components/Button/Button.module.css';

import styles from './page.module.css';
import { IconCheck } from '@tabler/icons-react';

const SettingsPage = async () => {
  const traewellingStatus = await getTraewellingAuthStatus();

  return (
    <>
      <h1>Settings</h1>

      <h2>Connected services</h2>

      <div className={styles.connectedServiceContainer}>
        <span className={styles.connectedServiceName}>Traewelling</span>

        {traewellingStatus.connected ? (
          <div className={styles.connectedServiceStatus}>
            <IconCheck color="var(--success)" />
            {traewellingStatus.user.username ? (
              <span>{traewellingStatus.user.username}</span>
            ) : (
              <span>Connected</span>
            )}
          </div>
        ) : (
          <a
            className={classNames(
              buttonStyles.button,
              buttonStyles.smallButton,
              styles.connectedServiceLink
            )}
            href={traewellingStatus.authUrl}>
            Connect
          </a>
        )}
      </div>
    </>
  );
};

export default SettingsPage;
