import { StoryblokComponent, storyblokEditable } from '@storyblok/react';
import './HeroSection.css';

export default function HeroSection({ blok }) {
  return (
    <section
      {...storyblokEditable(blok)}
      className={[
        'hero-section',
        blok.layout && `hero-section--${blok.layout}`,
        blok.background_color && `hero-section--bg-${blok.background_color}`,
        blok.text_alignment && `hero-section--align-${blok.text_alignment}`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="hero-section__content">
        {blok.eyebrow && (
          <p className="hero-section__eyebrow">{blok.eyebrow}</p>
        )}

        {blok.headline?.length > 0 && (
          <h1 className="hero-section__headline">
            {blok.headline.map((nestedBlok) => (
              <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
            ))}
          </h1>
        )}

        {blok.text && <p className="hero-section__text">{blok.text}</p>}

        {blok.buttons?.length > 0 && (
          <div className="hero-section__buttons">
            {blok.buttons.map((nestedBlok) => (
              <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
            ))}
          </div>
        )}
      </div>

      {blok.image?.filename && (
        <div
          className={[
            'hero-section__media',
            blok.secondary_background_color &&
              `hero-section__media--bg-${blok.secondary_background_color}`,
            blok.image_decoration && 'hero-section__media--decorated',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <img
            className="hero-section__image"
            src={blok.image.filename}
            alt={blok.image.alt || ''}
          />
        </div>
      )}
    </section>
  );
}
