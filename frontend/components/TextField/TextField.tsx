import { InputHTMLAttributes } from 'react';
import classNames from 'classnames';

import styles from './TextField.module.css';

interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'onKeyPress'
> {
  value?: string;
  onChange?: (newValue: string) => void;
  onBlur?: () => void;
  onKeyPress?: (key: string) => void;
}

export const TextField: React.FC<TextFieldProps> = ({
  className,
  value = '',
  onChange,
  onBlur,
  onKeyPress,
  type = 'text',
  ...rest
}) => (
  <input
    className={classNames(styles.textField, className)}
    type={type}
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
    onBlur={onBlur}
    onKeyUp={(e) => onKeyPress?.(e.key)}
    {...rest}
  />
);
