'use client';

import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IconCircleX } from '@tabler/icons-react';

import { Coaster } from '@logaliser/api';
import { createCoasterActivity } from '@/lib/logaliser-api';
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

  const queryClient = useQueryClient();

  const {
    mutate: createActivity,
    isPending: loading,
    error,
  } = useMutation({
    mutationFn: ({ coasterId, timestamp }: LogaliseCoasterMutationVariables) =>
      createCoasterActivity(coasterId, timestamp),
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
                queryClient.invalidateQueries({ queryKey: ['allActivities'] });
                router.push('/');
              },
            }
          );
        }}>
        <Form className={styles.form}>
          <label>
            <input
              name="setTimestamp"
              type="checkbox"
              onChange={(e) => setShowTimestampField(e.target.checked)}
              disabled={loading}
            />
            Override timestamp
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
