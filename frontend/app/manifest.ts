import { MetadataRoute } from 'next';

const generateManifest = (): MetadataRoute.Manifest => ({
  name: 'Logaliser',
  background_color: '#0a0a0a',
  theme_color: '#0a0a0a',
  orientation: 'portrait',
  display: 'standalone',
  start_url: '/',
  icons: [
    {
      src: '/icon.png',
      sizes: 'any',
      type: 'image/png',
    },
  ],
});

export default generateManifest;
