import classNames from 'classnames';
import { ButtonHTMLAttributes } from 'react';

import styles from './Button.module.css';

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  small?: boolean;
  theme?: 'primary' | 'secondary';
}

export const Button = ({
  children,
  onClick,
  className,
  disabled,
  type = 'button',
  small,
  theme = 'primary',
}: ButtonProps) => (
  <button
    className={classNames(styles.button, styles[theme], className, {
      [styles.smallButton]: small,
    })}
    onClick={onClick}
    disabled={disabled}
    type={type}>
    {children}
  </button>
);
