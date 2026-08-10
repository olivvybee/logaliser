'use client';

import { useSearchParams } from 'next/navigation';

const TraewellingCallbackPage = () => {
  const params = useSearchParams();

  const code = params.get('code');

  return <div>{code}</div>;
};

export default TraewellingCallbackPage;
