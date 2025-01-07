import { Hashable } from './hashing';
import { Entity } from './urls';

export const uploadData = async (entity: Entity, items: Hashable[]) => {
  const path = entity === Entity.Park ? 'theme-parks' : 'coasters';
  const url = `${process.env.LOGALISE_DB_API}/${path}/update`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(items),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(error);
    process.exit(1);
  }

  console.log('Successfully uploaded data!');
};
