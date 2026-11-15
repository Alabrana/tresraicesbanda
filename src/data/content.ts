import { z } from 'astro/zod';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import bandSource from './band.json';
import collaboratorsSource from './collaborators.json';
import gallerySource from './gallery.json';
import mediaSource from './media.json';
import networkSource from './network.json';
import siteSource from './site.json';

const id = z.string().min(1);
const existingImagePath = z
  .string()
  .startsWith('/images/')
  .refine(
    (value) => existsSync(join(process.cwd(), 'public', value)),
    'La imagen referenciada no existe en public/images.',
  );
const imagePath = z.union([z.literal(''), existingImagePath]);
const optionalUrl = z.url().optional();

const bandSchema = z.object({
  intro: z.string(),
  history: z.string(),
  groupPhoto: imagePath,
  members: z
    .array(
      z.object({
        id: z.enum(['victor', 'alex', 'pato']),
        name: z.string().min(1),
        instrument: z.string().min(1),
        photo: imagePath,
        bio: z.string(),
      }),
    )
    .length(3)
    .refine(
      (members) => new Set(members.map((member) => member.id)).size === 3,
      'La banda debe conservar los IDs victor, alex y pato.',
    ),
});

const mediaSchema = z.object({
  platforms: z.array(
    z.object({
      id,
      name: z.string().min(1),
      url: z.url(),
      visible: z.boolean(),
    }),
  ),
  videos: z.array(
    z.object({
      id,
      title: z.string().min(1),
      youtubeUrl: z.url(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      description: z.string().min(1).optional(),
      visible: z.boolean(),
    }),
  ),
});

const gallerySchema = z.object({
  photos: z.array(
    z.object({
      id,
      image: existingImagePath,
      description: z.string(),
      visible: z.boolean(),
    }),
  ),
});

const linkedLogo = z.object({
  id,
  name: z.string().min(1),
  logo: existingImagePath,
  url: optionalUrl,
  visible: z.boolean(),
});

export const band = bandSchema.parse(bandSource);
export const media = mediaSchema.parse(mediaSource);
export const gallery = gallerySchema.parse(gallerySource);
export const network = z.object({ bands: z.array(linkedLogo) }).parse(networkSource);
export const collaborators = z
  .object({ collaborators: z.array(linkedLogo) })
  .parse(collaboratorsSource);

// El contrato global sigue deliberadamente vacío hasta que se confirmen datos reales.
export const site = z.object({}).strict().parse(siteSource);
