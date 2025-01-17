'use client';

import { useState } from 'react';
import { setCookie } from './setCookie';

export const ApiKeyForm = () => {
  const [value, setValue] = useState('');
  const [invalid, setInvalid] = useState(false);

  const onSave = async () => {
    setInvalid(false);
    const success = await setCookie(value);
    if (success) {
      window.location.pathname = '/';
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
