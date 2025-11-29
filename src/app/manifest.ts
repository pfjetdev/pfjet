import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Priotiy Flyers Jet - Private Jet Charter',
    short_name: 'Priotiy Flyers Jet',
    description: 'Book private jet flights worldwide. Empty legs, jet sharing, and luxury charter services.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    orientation: 'portrait-primary',
    categories: ['travel', 'lifestyle', 'business'],
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Book a Flight',
        short_name: 'Book',
        description: 'Book a private jet charter',
        url: '/?action=book',
        icons: [{ src: '/icons/shortcut-book.png', sizes: '96x96', type: 'image/png' }],
      },
      {
        name: 'Empty Legs',
        short_name: 'Empty Legs',
        description: 'Browse discounted empty leg flights',
        url: '/empty-legs',
        icons: [{ src: '/icons/shortcut-emptylegs.png', sizes: '96x96', type: 'image/png' }],
      },
      {
        name: 'Our Fleet',
        short_name: 'Fleet',
        description: 'View our aircraft fleet',
        url: '/fleet',
        icons: [{ src: '/icons/shortcut-fleet.png', sizes: '96x96', type: 'image/png' }],
      },
    ],
  }
}
