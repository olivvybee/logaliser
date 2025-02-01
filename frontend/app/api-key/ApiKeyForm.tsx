'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';

import { setCookie } from './setCookie';

import styles from './ApiKeyForm.module.css';

export const ApiKeyForm = () => {
  const [value, setValue] = useState('');
  const [invalid, setInvalid] = useState(false);
  const searchParams = useSearchParams();

  const onSave = async () => {
    setInvalid(false);
    const success = await setCookie(value);
    if (success) {
      window.location.pathname = searchParams.get('requestedPath') || '/';
    } else {
      setInvalid(true);
    }
  };

  return (
    <>
      <h1>Enter API key</h1>
      <form action={onSave} className={styles.form}>
        <TextField
          type="text"
          value={value}
          onChange={(value) => setValue(value)}
          placeholder="API key"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
        />

        {invalid && <div>Nope that's wrong</div>}

        <Button type="submit">Save</Button>
      </form>
    </>
  );
};
