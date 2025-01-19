import { getCountryList } from '@/lib/logaliser-api/server/coasters';
import { CoasterLookup } from './CoasterLookup';

const LogaliseCoasterPage = async () => {
  const countries = await getCountryList();

  return <CoasterLookup countries={countries} />;
};

export default LogaliseCoasterPage;
