'use client';

import { FormEvent, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { IconCircleX } from '@tabler/icons-react';

import { Coaster } from '@/lib/logaliser-api/types';
import { createCoasterActivity } from '@/lib/logaliser-api/client/coasters';
import { markCoasterRidden } from '@/lib/roller-coaster-tracker/markCoasterRidden';
import { Button } from '@/components/Button';

import { CoasterLookup } from './CoasterLookup';

import styles from './page.module.css';

interface LogaliseCoasterMutationVariables {
  coasterId: number;
  firstRide: boolean;
}

const LogaliseCoasterPage = () => {
  const router = useRouter();

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
    return (
      <>
        <h1>Logalise a coaster</h1>
        <CoasterLookup onSelectCoaster={setSelectedCoaster} />
      </>
    );
  }

  return (
    <>
      <h1>Logalise a coaster</h1>

      <div className={styles.selectedCoaster}>
        <div className={styles.coasterDetails}>
          <span className={styles.coasterName}>{selectedCoaster.name}</span>
          <span className={styles.parkName}>{selectedCoaster.park.name}</span>
        </div>

        <Button
          theme="ghost"
          iconOnly={true}
          onClick={() => setSelectedCoaster(undefined)}>
          <IconCircleX />
        </Button>
      </div>

      <Formik
        initialValues={{ firstRide: false }}
        onSubmit={({ firstRide }) => {
          createActivity(
            { coasterId: selectedCoaster.id, firstRide },
            {
              onSuccess: () => {
                if (firstRide) {
                  // Disabled until roller-coaster-tracker uses rcdb ids
                  // markRidden(selectedCoaster.id);
                }
                router.push('/');
              },
            }
          );
        }}>
        <Form className={styles.form}>
          <label>
            <Field name="firstRide" type="checkbox" />
            First ride
          </label>

          <Button
            type="submit"
            loading={createActivityPending || markRiddenPending}>
            Logalise
          </Button>
        </Form>
      </Formik>
    </>
  );
};

export default LogaliseCoasterPage;
