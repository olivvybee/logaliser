'use client';

import { useState } from 'react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { IconCircleX } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Station } from '@logaliser/api';
import {
  getCountryList,
  getNearbyStations,
  searchForStations,
  startTrainActivity,
} from '@/lib/logaliser-api/trains';
import { Button } from '@/components/Button';
import { EntityChooser } from '@/components/EntityChooser';

import styles from './page.module.css';

interface StartTrainActivityMutationVariables {
  stationId: number;
}

const LogaliseTrainPage = () => {
  const router = useRouter();

  const [selectedStation, setSelectedStation] = useState<Station>();

  const queryClient = useQueryClient();

  const { mutate: createActivity, isPending: loading } = useMutation({
    mutationFn: ({ stationId }: StartTrainActivityMutationVariables) =>
      startTrainActivity(stationId),
  });

  if (!selectedStation) {
    return (
      <>
        <h1>Logalise a train</h1>
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
      <h1>Logalise a train</h1>

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
          createActivity(
            {
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

export default LogaliseTrainPage;
