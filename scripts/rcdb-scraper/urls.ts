const BASE_URL = 'https://rcdb.com';
const SEARCH_ENDPOINT = 'r.htm';

export enum Entity {
  Coaster = 2,
  Park = 3,
}

export enum Filter {
  Existing = 'ex',
  Defunct = 'df',
}

export const getUrl = (entity: Entity, filter?: Filter) => {
  const searchParams = new URLSearchParams();
  searchParams.set('ot', entity.toString());

  if (entity === Entity.Coaster) {
    searchParams.append('st', '93');
    searchParams.append('st', '311');
  }

  if (filter) {
    searchParams.set(filter.toString(), 'on');
  }

  return `${BASE_URL}/${SEARCH_ENDPOINT}?${searchParams.toString()}`;
};

export const buildUrl = (path: string) => {
  const normalisedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${normalisedPath}`;
};

export const getIdFromUrl = (url: string) => {
  const match = url.match(/\d+/g);
  if (match) {
    return parseInt(match[0]);
  }
  return -1;
};
