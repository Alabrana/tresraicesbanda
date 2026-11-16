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
