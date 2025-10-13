import styles from './page.module.css';
import Link from 'next/link';
import { IconRollercoasterFilled, IconTrack } from '@tabler/icons-react';

const LogalisePage = async () => {
  return (
    <>
      <h1>Logalise</h1>

      <ul className={styles.menu}>
        <li>
          <Link href="/logalise/coaster">
            <IconRollercoasterFilled />
            Coaster
          </Link>
        </li>
        <li>
          <Link href="/logalise/train">
            <IconTrack />
            Train
          </Link>
        </li>
      </ul>
    </>
  );
};

export default LogalisePage;
