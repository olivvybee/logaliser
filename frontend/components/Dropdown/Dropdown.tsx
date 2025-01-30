import styles from './Dropdown.module.css';

interface DropdownProps {
  value?: string;
  onChange: (value: string) => void;
  options: readonly string[];
  includeBlankOption?: boolean;
}

export const Dropdown = ({
  value,
  onChange,
  options,
  includeBlankOption,
}: DropdownProps) => (
  <select
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
    className={styles.dropdown}>
    {includeBlankOption && <option value="">---</option>}

    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);
