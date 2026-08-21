import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import App from "./App"
import { storyblokInit, apiPlugin } from '@storyblok/react';

import Page from './storyblok/Page';
import HeroSection from './storyblok/HeroSection';
import HeadlineSegment from './storyblok/HeadlineSegment';
import Button from './storyblok/Button';

storyblokInit({
  accessToken: import.meta.env.VITE_STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  components: {
    // Keys = blok.component del JSON de Storyblok
    'default-page': Page,
    'hero-section': HeroSection,
    'headline-segment': HeadlineSegment,
    button: Button,
  },
  apiOptions: {
    region: 'eu',
  },
});

const root = document.getElementById('root');

createRoot(root).render(
  <StrictMode>
    <App/>
  </StrictMode>
);