import { Hashable } from './hashing';
import { Entity } from './urls';

interface UploadResponse {
  successfulUpdates: Hashable[];
  failedUpdates: Array<{ data: Hashable; error: Error }>;
}

export const uploadData = async (entity: Entity, items: Hashable[]) => {
  const path = entity === Entity.Park ? 'theme-parks' : 'coasters';
  const url = `${process.env.LOGALISE_DB_API}/${path}/import`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(items),
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
