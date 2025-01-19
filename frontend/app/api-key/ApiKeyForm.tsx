'use client';

import { useState } from 'react';
import { setCookie } from './setCookie';
import { useSearchParams } from 'next/navigation';

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
    <form action={onSave}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="API key"
      />

      {invalid && <div>Nope that's wrong</div>}

      <button type="submit">Save</button>
    </form>
  );
};
