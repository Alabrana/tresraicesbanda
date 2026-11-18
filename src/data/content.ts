import {
  bandSchema,
  collaboratorsSchema,
  gallerySchema,
  mediaSchema,
  networkSchema,
  siteSchema,
} from '../lib/contracts';
import bandSource from './band.json';
import collaboratorsSource from './collaborators.json';
import gallerySource from './gallery.json';
import mediaSource from './media.json';
import networkSource from './network.json';
import siteSource from './site.json';

export const band = bandSchema.parse(bandSource);
export const media = mediaSchema.parse(mediaSource);
export const gallery = gallerySchema.parse(gallerySource);
export const network = networkSchema.parse(networkSource);
export const collaborators = collaboratorsSchema.parse(collaboratorsSource);
export const site = siteSchema.parse(siteSource);

export const siteIdentity = {
  name: 'Tres Raíces',
  location: 'Talcahuano, Chile',
  locationLabel: 'TALCAHUANO · CHILE',
  statement: 'ROCK DEL PUERTO.',
  descriptor: 'Tres músicos. Tres historias. La misma raíz.',
} as const;

export const publicNavigation = [
  { label: 'La Banda', href: '/banda/', footerOrder: 0 },
  { label: 'Media', href: '/media/', footerOrder: 2 },
  { label: 'En Vivo', href: '/en-vivo/', footerOrder: 1 },
  { label: 'News', href: '/news/', footerOrder: 3 },
  { label: 'Galería', href: '/galeria/', footerOrder: 4 },
  { label: 'Network', href: '/network/', footerOrder: 5 },
] as const;

export const footerNavigation = [...publicNavigation].sort(
  (left, right) => left.footerOrder - right.footerOrder,
);
