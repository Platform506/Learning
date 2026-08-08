import {defineField, defineType} from 'sanity'
import { CalendarIcon } from '@sanity/icons/Calendar'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'details', title: 'Details'},
    {name: 'editorial', title: 'Editorial'},
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'details',
      options: {
        source: 'name',
      },
      hidden: ({document}) => !document?.name,
      validation: (rule) => rule
      .required()
      .error(`Required to generate a page on the website`),
    }),
    defineField({
      name: 'eventType',
      type: 'string',
      group: 'details',
      options: {
        list: ['in-person', 'virtual'],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'date',
      type: 'datetime',
      group: 'details',
    }),
    defineField({
      name: 'doorsOpen',
      description: 'Number of minutes before the start time for admission',
      type: 'number',
      initialValue: 60,
      group: 'details',
    }),
    defineField({
      name: 'venue',
      type: 'reference',
      group: 'details',
      to: [{type: 'venue'}],
      readOnly: ({value, document}) => !value && document?.eventType === 'virtual',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (value && context?.document?.eventType === 'virtual') {
            return 'Only in-person events can have a venue'
          }
    
          return true
        }),
    }),
    defineField({
      name: 'headline',
      group: 'editorial',
      type: 'reference',
      to: [{type: 'artist'}],
      
    }),
    defineField({
      name: 'image',
      group: 'editorial',
      type: 'image',
    }),
    defineField({
      name: 'details',
      group: 'editorial',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'tickets',
      group: 'editorial',
      type: 'url',
    }),
  ],
  // Update the preview key in the schema
preview: {
  select: {
    name: 'name',
    venue: 'venue.name',
    artist: 'headline.name',
    date: 'date',
    image: 'image',
  },
  prepare({name, venue, artist, date, image}) {
    const nameFormatted = name || 'Untitled event'
    const dateFormatted = date
      ? new Date(date).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })
      : ''

    return {
      title: artist ? `${nameFormatted} (${artist})` : nameFormatted,
      subtitle: venue ? `${dateFormatted} @ ${venue}` : dateFormatted,
      media: image || CalendarIcon,
    }
  },
},
})