import { storyblokEditable } from '@storyblok/react';
import './Button.css';

function resolveHref(link) {
  if (!link) return '#';
  const raw = link.url || link.cached_url || '#';
  if (raw.startsWith('http') || raw.startsWith('#')) return raw;
  return `/${raw}`;
}

export default function Button({ blok }) {
  return (
    <a
      {...storyblokEditable(blok)}
      href={resolveHref(blok.link)}
      className={[
        'sb-button',
        blok.size && `sb-button--${blok.size}`,
        blok.style && `sb-button--${blok.style}`,
        blok.background_color && `sb-button--bg-${blok.background_color}`,
        blok.text_color && `sb-button--text-${blok.text_color}`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {blok.label}
    </a>
  );
}
