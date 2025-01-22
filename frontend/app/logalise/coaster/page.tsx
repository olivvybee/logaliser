'use client';

import { FormEvent, useState } from 'react';

import { Coaster, CoasterActivity } from '@/lib/logaliser-api/types';
import { CoasterLookup } from './CoasterLookup';
import { useMutation } from '@tanstack/react-query';
import { createCoasterActivity } from '@/lib/logaliser-api/client/coasters';
import { Formik, Form, Field } from 'formik';
import { markCoasterRidden } from '@/lib/roller-coaster-tracker/markCoasterRidden';

interface LogaliseCoasterMutationVariables {
  coasterId: number;
  firstRide: boolean;
}

const LogaliseCoasterPage = () => {
  const [selectedCoaster, setSelectedCoaster] = useState<Coaster>();

  const {
    mutate: createActivity,
    isPending: createActivityPending,
    error: createActivityError,
  } = useMutation({
    mutationFn: ({ coasterId, firstRide }: LogaliseCoasterMutationVariables) =>
      createCoasterActivity(coasterId, firstRide),
  });

  const {
    mutate: markRidden,
    isPending: markRiddenPending,
    error: markRiddenError,
  } = useMutation({
    mutationFn: (coasterId: number) => markCoasterRidden(coasterId),
  });

  if (!selectedCoaster) {
    return <CoasterLookup onSelectCoaster={setSelectedCoaster} />;
  }

  return (
    <Formik
      initialValues={{ firstRide: false }}
      onSubmit={({ firstRide }) => {
        createActivity({ coasterId: selectedCoaster.id, firstRide });
        if (firstRide) {
          // Disabled until roller-coaster-tracker uses rcdb ids
          // markRidden(selectedCoaster.id);
        }
      }}>
      <Form>
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
