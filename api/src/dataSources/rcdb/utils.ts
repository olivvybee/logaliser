export const buildUrl = (path: string) => {
  const normalisedPath = path.startsWith('/') ? path.slice(1) : path;
  return `https://rcdb.com/${normalisedPath}`;
};

export const getIdFromUrl = (url: string) => {
  const match = url.match(/\d+/g);
  if (match) {
    return parseInt(match[0]);
  }
  return -1;
};
