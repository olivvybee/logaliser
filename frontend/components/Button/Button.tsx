import classNames from 'classnames';
import { ButtonHTMLAttributes } from 'react';

import styles from './Button.module.css';
import { Spinner } from '../Spinner';

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  small?: boolean;
  theme?: 'primary' | 'secondary' | 'ghost';
  iconOnly?: boolean;
  loading?: boolean;
}

export const Button = ({
  children,
  onClick,
  className,
  disabled,
  type = 'button',
  small,
  theme = 'primary',
  iconOnly,
  loading,
}: ButtonProps) => {
  const content = loading ? (
    <div className={styles.loading}>
      <Spinner size={16} /> {!iconOnly && children}
    </div>
  ) : (
    children
  );

  return (
    <button
      className={classNames(styles.button, styles[theme], className, {
        [styles.smallButton]: small,
        [styles.iconOnly]: iconOnly,
      })}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}>
      {content}
    </button>
  );
};
