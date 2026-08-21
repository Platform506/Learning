import { storyblokEditable } from '@storyblok/react';
import './HeadlineSegment.css';

export default function HeadlineSegment({ blok }) {
  return (
    <span
      {...storyblokEditable(blok)}
      className={[
        'headline-segment',
        blok.highlight &&
          blok.highlight !== 'none' &&
          `headline-segment--${blok.highlight}`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {blok.text}
    </span>
  );
}
