import { Suspense } from 'react';
import { ApiKeyForm } from './ApiKeyForm';

const ApiKeyPage = () => (
  <Suspense>
    <ApiKeyForm />
  </Suspense>
);

export default ApiKeyPage;
