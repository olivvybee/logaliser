'use client';

import { useState } from 'react';
import { Form, Formik } from 'formik';
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

import styles from '../../page.module.css';

interface CompleteTrainActivityMutationVariables {
  activityId: number;
  stationId: number;
}

const CompleteTrainActivityPage = () => {
  const params = useParams();
  const activityId = parseInt(params['id'] as string);

  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedStation, setSelectedStation] = useState<Station>();

  const { mutate: completeActivity, isPending: loading } = useMutation({
    mutationFn: ({
      activityId,
      stationId,
    }: CompleteTrainActivityMutationVariables) =>
      completeTrainActivity(activityId, stationId),
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
        initialValues={{}}
        onSubmit={({}) => {
          completeActivity(
            {
              activityId,
              stationId: selectedStation.id,
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
          <Button type="submit" loading={loading}>
            Logalise
          </Button>
        </Form>
      </Formik>
    </>
  );
};

export default CompleteTrainActivityPage;
