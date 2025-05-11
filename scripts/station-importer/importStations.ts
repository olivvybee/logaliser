import decompress from 'decompress';
import { XMLParser } from 'fast-xml-parser';
import { Station } from '@logaliser/api';
import { uploadData } from './uploadData';

interface StationResponse {
  CrsCode: string;
  AlternativeIdentifiers: {
    NationalLocationCode: number;
  };
  Name: string;
  Longitude: number;
  Latitude: number;
}

export const importStations = async () => {
  const data = await getData();

  const parser = new XMLParser();
  const parsedData = parser.parse(data);

  const stations = parsedData.StationList.Station as StationResponse[];
  const parsedStations = stations.map(parseStation);

  const validStations = parsedStations.filter(
    (station) => typeof station.nationalId === 'number'
  );

  await uploadData(validStations);
};

const parseStation = (station: StationResponse): Omit<Station, 'id'> => ({
  nationalId: station.AlternativeIdentifiers.NationalLocationCode,
  name: station.Name,
  country: 'United Kingdom',
  code: station.CrsCode,
  latitude: station.Latitude,
  longitude: station.Longitude,
});

const ZIP_FILE_URL = 'https://internal.nationalrail.co.uk/4.0/stations.zip';

export const getData = async () => {
  console.log('Downloading station data...');
  const response = await fetch(ZIP_FILE_URL);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  console.log('Unzipping...');
  const fileList = await decompress(buffer);
  return fileList[0].data;
};
