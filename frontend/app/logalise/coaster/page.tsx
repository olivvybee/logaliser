'use client';

import { FormEvent, useState } from 'react';

import { Coaster, CoasterActivity } from '@/lib/logaliser-api/types';
import { CoasterLookup } from './CoasterLookup';
import { useMutation } from '@tanstack/react-query';
import { createCoasterActivity } from '@/lib/logaliser-api/client/coasters';
import { Formik, Form, Field } from 'formik';

interface LogaliseCoasterMutationVariables {
  coasterId: number;
  firstRide: boolean;
}

const LogaliseCoasterPage = () => {
  const [selectedCoaster, setSelectedCoaster] = useState<Coaster>();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ coasterId, firstRide }: LogaliseCoasterMutationVariables) =>
      createCoasterActivity(coasterId, firstRide),
  });

  if (!selectedCoaster) {
    return <CoasterLookup onSelectCoaster={setSelectedCoaster} />;
  }

  const onSubmit = (data: FormData) => {
    console.log({
      coasterId: selectedCoaster.id,
      firstRide: data.get('firstRide'),
    });
  };

  return (
    <Formik
      initialValues={{ firstRide: false }}
      onSubmit={({ firstRide }) =>
        mutate({ coasterId: selectedCoaster.id, firstRide })
      }>
      <Form action={onSubmit}>
        <div>
          Selected {selectedCoaster.name} at {selectedCoaster.park.name}
        </div>

        <label>
          <Field name="firstRide" type="checkbox" />
          First ride
        </label>

        <button type="submit">Logalise</button>
      </Form>
    </Formik>
  );
};

export default LogaliseCoasterPage;
