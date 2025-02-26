export const fetchUrl = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1.1 Safari/605.1.15',
      'Accept-Language': 'en-GB',
      Cookie: 'uom=2', // Set measurements to metric
    },
  });

  const body = await response.text();
  return body;
};
