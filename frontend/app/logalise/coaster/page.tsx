'use client';

import { FormEvent, useState } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { IconCircleX } from '@tabler/icons-react';

import { Coaster } from '@/lib/logaliser-api/types';
import { createCoasterActivity } from '@/lib/logaliser-api/client/coasters';
import { markCoasterRidden } from '@/lib/roller-coaster-tracker/markCoasterRidden';
import { Button } from '@/components/Button';
import TextFieldStyles from '@/components/TextField/TextField.module.css';

import { CoasterLookup } from './CoasterLookup';

import styles from './page.module.css';

interface LogaliseCoasterMutationVariables {
  coasterId: number;
  firstRide: boolean;
  timestamp?: string;
}

const LogaliseCoasterPage = () => {
  const router = useRouter();

  const [selectedCoaster, setSelectedCoaster] = useState<Coaster>();
  const [showTimestampField, setShowTimestampField] = useState(false);

  const now = new Date().toISOString().slice(0, 16);

  const {
    mutate: createActivity,
    isPending: createActivityPending,
    error: createActivityError,
  } = useMutation({
    mutationFn: ({
      coasterId,
      firstRide,
      timestamp,
    }: LogaliseCoasterMutationVariables) =>
      createCoasterActivity(coasterId, firstRide, timestamp),
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

  const loading = createActivityPending || markRiddenPending;

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
        initialValues={{ firstRide: false, timestamp: now }}
        onSubmit={({ firstRide, timestamp }) => {
          createActivity(
            {
              coasterId: selectedCoaster.id,
              firstRide,
              timestamp: showTimestampField
                ? new Date(timestamp).toISOString()
                : undefined,
            },
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
            <Field name="firstRide" type="checkbox" disabled={loading} />
            First ride
          </label>

          <label>
            <input
              name="setTimestamp"
              type="checkbox"
              onChange={(e) => setShowTimestampField(e.target.checked)}
              disabled={loading}
            />
            Set timestamp
          </label>

          {showTimestampField && (
            <Field
              className={TextFieldStyles.textField}
              name="timestamp"
              type="datetime-local"
              disabled={loading}
            />
          )}

          <Button type="submit" loading={loading}>
            Logalise
          </Button>
        </Form>
      </Formik>
    </>
  );
};

export default LogaliseCoasterPage;
