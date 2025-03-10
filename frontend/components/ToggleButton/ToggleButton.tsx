import { useId } from 'react';
import styles from './ToggleButton.module.css';
import classNames from 'classnames';

interface Option<T> {
  value: T;
  label: string;
}

export interface ToggleButtonProps<T> {
  options: Option<T>[];
  value: string;
  name: string;
  onChange: (newValue: T) => void;
}

export const ToggleButton = <T,>({
  options,
  value,
  name,
  onChange,
}: ToggleButtonProps<T>) => {
  const id = useId();

  return (
    <div className={styles.toggleButton} role="radiogroup">
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <label
            key={`${option.value}`}
            className={classNames(styles.option, {
              [styles.selected]: isSelected,
            })}
            htmlFor={`${id}-${option.value}`}>
            <span>{option.label}</span>
            <input
              className={styles.input}
              id={`${id}-${option.value}`}
              name={name}
              type="radio"
              checked={isSelected}
              onChange={() => onChange(option.value)}
            />
          </label>
        );
      })}
    </div>
  );
};
