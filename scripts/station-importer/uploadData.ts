import { Station } from '@logaliser/api';

interface UploadResponse {
  successfulUpdates: Station[];
  failedUpdates: Array<{ data: Station; error: Error }>;
}

export const uploadData = async (stations: Omit<Station, 'id'>[]) => {
  const url = `${process.env.LOGALISER_API_URL}/stations/import`;

  const apiKey = process.env.LOGALISER_API_KEY;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(stations),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    process.exit(1);
  }

  const result = (await response.json()) as UploadResponse;
  console.log(`Successful updates: ${result.successfulUpdates.length}`);
  console.log(`Failed updates: ${result.failedUpdates.length}`);
  result.failedUpdates.forEach((failedUpdate) => {
    console.error(JSON.stringify(failedUpdate, null, 2));
  });
};
