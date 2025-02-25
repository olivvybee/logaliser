export const markCoasterRidden = async (coasterId: number) => {
  const baseUrl = process.env.NEXT_PUBLIC_ROLLER_COASTER_TRACKER_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_ROLLER_COASTER_TRACKER_API_KEY;

  if (!baseUrl) {
    throw new Error(
      'ROLLER_COASTER_TRACKER_API_URL environment variable is not set'
    );
  }
  if (!apiKey) {
    throw new Error(
      'ROLLER_COASTER_TRACKER_API_KEY environment variable is not set'
    );
  }

  const url = `${baseUrl}/coasters/markRidden`;
  const data = {
    coasters: [coasterId],
    includeDate: true,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      ['Content-Type']: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed with code ${response.status}: ${text}`);
  }
};
