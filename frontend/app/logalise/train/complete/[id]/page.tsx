'use client';

import { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IconCircleX } from '@tabler/icons-react';

import { Station } from '@logaliser/api';
import { Button } from '@/components/Button';
import {
  completeTrainActivity,
  getCountryList,
  getNearbyStations,
  searchForStations,
} from '@/lib/logaliser-api/trains';
import { EntityChooser } from '@/components/EntityChooser';
import TextFieldStyles from '@/components/TextField/TextField.module.css';

import styles from '../../page.module.css';

interface CompleteTrainActivityMutationVariables {
  activityId: number;
  stationId: number;
  timestamp?: string;
}

const CompleteTrainActivityPage = () => {
  const params = useParams();
  const activityId = parseInt(params['id'] as string);

  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedStation, setSelectedStation] = useState<Station>();
  const [showTimestampField, setShowTimestampField] = useState(false);

  const now = new Date().toISOString().slice(0, 16);

  const { mutate: completeActivity, isPending: loading } = useMutation({
    mutationFn: ({
      activityId,
      stationId,
      timestamp,
    }: CompleteTrainActivityMutationVariables) =>
      completeTrainActivity(activityId, stationId, timestamp),
  });

  if (!selectedStation) {
    return (
      <>
        <h1>Complete train activity</h1>
        <EntityChooser
          key="station"
          onSelect={setSelectedStation}
          nearbyQueryFn={getNearbyStations}
          searchQueryFn={searchForStations}
          countriesQueryFn={getCountryList}
          getName={(station) => station.name}
          getDetails={(station) => station.code || undefined}
        />
      </>
    );
  }

  return (
    <>
      <h1>Complete train activity</h1>

      <div className={styles.selectedStation}>
        <div className={styles.stationDetails}>
          <span className={styles.stationName}>{selectedStation.name}</span>
          {selectedStation.code && (
            <span className={styles.stationCode}>{selectedStation.code}</span>
          )}
        </div>

        <Button
          theme="ghost"
          iconOnly={true}
          onClick={() => setSelectedStation(undefined)}>
          <IconCircleX />
        </Button>
      </div>

      <Formik
        initialValues={{ timestamp: now }}
        onSubmit={({ timestamp }) => {
          completeActivity(
            {
              activityId,
              stationId: selectedStation.id,
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

export default CompleteTrainActivityPage;
