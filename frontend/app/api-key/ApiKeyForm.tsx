'use client';

import { useState } from 'react';
import { setCookie } from './setCookie';

export const ApiKeyForm = () => {
  const [value, setValue] = useState('');

  const onSave = async () => {
    await setCookie(value);
    window.location.pathname = '/';
  };

  return (
    <form action={onSave}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="API key"
      />

      <button type="submit">Save</button>
    </form>
  );
};
