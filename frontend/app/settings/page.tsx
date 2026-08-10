import { generateTraewellingAuthUrl } from './generateTraewellingAuthUrl';

const SettingsPage = () => {
  const traewellingAuthUrl = generateTraewellingAuthUrl();

  return (
    <>
      <h1>Settings</h1>

      <a href={traewellingAuthUrl}>Authorise</a>
    </>
  );
};

export default SettingsPage;
