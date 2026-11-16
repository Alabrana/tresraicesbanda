import { existsSync, realpathSync, statSync } from 'node:fs';
import { extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { z } from 'astro/zod';
import { isCivilDate } from './civil-date.ts';

const PUBLIC_IMAGES_ROOT = resolve(process.cwd(), 'public/images');
const ALLOWED_IMAGE_EXTENSIONS = new Set([
  '.avif',
  '.gif',
  '.jpeg',
  '.jpg',
  '.png',
  '.svg',
  '.webp',
]);
const SAFE_IDENTIFIER_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

function isPathInside(parent: string, target: string): boolean {
  const pathFromParent = relative(parent, target);

  return (
    pathFromParent !== '' &&
    pathFromParent !== '..' &&
    !pathFromParent.startsWith(`..${sep}`) &&
    !isAbsolute(pathFromParent)
  );
}

export function isSafePublicImagePath(
  value: string,
  publicImagesRoot = PUBLIC_IMAGES_ROOT,
): boolean {
  if (
    !value.startsWith('/images/') ||
    value.includes('\\') ||
    value.includes('%') ||
    value.includes('?') ||
    value.includes('#') ||
    value.includes('\0')
  ) {
    return false;
  }

  const pathSegments = value.slice('/images/'.length).split('/');
  if (pathSegments.some((segment) => segment === '' || segment === '.' || segment === '..')) {
    return false;
  }

  const normalizedRoot = resolve(publicImagesRoot);
  const target = resolve(normalizedRoot, ...pathSegments);
  if (!isPathInside(normalizedRoot, target)) return false;
  if (!ALLOWED_IMAGE_EXTENSIONS.has(extname(target).toLowerCase())) return false;
  if (!existsSync(target) || !statSync(target).isFile()) return false;

  const realRoot = realpathSync(normalizedRoot);
  const realTarget = realpathSync(target);

  return isPathInside(realRoot, realTarget);
}

export function createImagePathSchema(publicImagesRoot = PUBLIC_IMAGES_ROOT) {
  return z.string().refine(
    (value) => isSafePublicImagePath(value, publicImagesRoot),
    'La imagen debe ser un archivo permitido y existente dentro de public/images.',
  );
}

function hasHttpProtocol(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function getYouTubeVideoId(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    let videoId: string | null = null;

    if (hostname === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] ?? null;
    } else if (hostname === 'youtube.com' || hostname.endsWith('.youtube.com')) {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v');
      } else {
        const [route, id] = url.pathname.split('/').filter(Boolean);
        if (route === 'embed' || route === 'shorts' || route === 'live') videoId = id ?? null;
      }
    }

    return videoId !== null && YOUTUBE_VIDEO_ID_PATTERN.test(videoId) ? videoId : null;
  } catch {
    return null;
  }
}

export function isYouTubeVideoUrl(value: string): boolean {
  return getYouTubeVideoId(value) !== null;
}

function uniqueIdArray<T extends z.ZodType<{ id: string }>>(itemSchema: T) {
  return z.array(itemSchema).superRefine((items, context) => {
    const firstIndexById = new Map<string, number>();

    items.forEach((item, index) => {
      const firstIndex = firstIndexById.get(item.id);
      if (firstIndex === undefined) {
        firstIndexById.set(item.id, index);
        return;
      }

      context.addIssue({
        code: 'custom',
        message: `El ID "${item.id}" está duplicado (primera aparición: ${firstIndex}).`,
        path: [index, 'id'],
      });
    });
  });
}

export const identifierSchema = z
  .string()
  .min(1)
  .max(80)
  .regex(SAFE_IDENTIFIER_PATTERN, 'Usa minúsculas, números y guiones simples.');
export const slugSchema = identifierSchema;
export const civilDateSchema = z
  .string()
  .refine(isCivilDate, 'La fecha debe ser real y usar el formato YYYY-MM-DD.');
export const localTimeSchema = z
  .string()
  .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'La hora debe ser real y usar el formato HH:mm.');
export const httpUrlSchema = z
  .url()
  .refine(hasHttpProtocol, 'La URL debe utilizar http o https.');
export const youtubeVideoUrlSchema = z
  .url()
  .refine(isYouTubeVideoUrl, 'La URL debe apuntar a un video válido de YouTube.');
export const imagePathSchema = createImagePathSchema();
export const optionalImagePathSchema = z.union([z.literal(''), imagePathSchema]);
export const showStatusSchema = z.enum(['scheduled', 'cancelled', 'rescheduled']);

export const newsSchema = z
  .object({
    title: z.string().trim().min(1),
    date: civilDateSchema,
    summary: z.string().trim().min(1),
    cover: imagePathSchema,
    images: z.array(imagePathSchema).optional(),
  })
  .strict();

export const showSchema = z
  .object({
    id: identifierSchema,
    title: z.string().trim().min(1),
    date: civilDateSchema,
    time: localTimeSchema,
    venue: z.string().trim().min(1),
    city: z.string().trim().min(1),
    address: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    poster: imagePathSchema,
    guestBands: z.array(z.string().trim().min(1)).optional(),
    ticketUrl: httpUrlSchema.optional(),
    status: showStatusSchema,
    visible: z.boolean(),
  })
  .strict();

const memberSchema = z
  .object({
    id: z.enum(['victor', 'alex', 'pato']),
    name: z.string().trim().min(1),
    instrument: z.string().trim().min(1),
    photo: optionalImagePathSchema,
    bio: z.string(),
  })
  .strict();

export const bandSchema = z
  .object({
    intro: z.string(),
    history: z.string(),
    groupPhoto: optionalImagePathSchema,
    members: z
      .array(memberSchema)
      .length(3)
      .refine(
        (members) => new Set(members.map((member) => member.id)).size === 3,
        'La banda debe conservar los IDs victor, alex y pato.',
      ),
  })
  .strict();

const platformSchema = z
  .object({
    id: identifierSchema,
    name: z.string().trim().min(1),
    url: httpUrlSchema,
    visible: z.boolean(),
  })
  .strict();

const videoSchema = z
  .object({
    id: identifierSchema,
    title: z.string().trim().min(1),
    youtubeUrl: youtubeVideoUrlSchema,
    date: civilDateSchema,
    description: z.string().trim().min(1).optional(),
    visible: z.boolean(),
  })
  .strict();

export const mediaSchema = z
  .object({
    platforms: uniqueIdArray(platformSchema),
    videos: uniqueIdArray(videoSchema),
  })
  .strict();

const galleryPhotoSchema = z
  .object({
    id: identifierSchema,
    image: imagePathSchema,
    description: z.string(),
    visible: z.boolean(),
  })
  .strict();

export const gallerySchema = z
  .object({ photos: uniqueIdArray(galleryPhotoSchema) })
  .strict();

const linkedLogoSchema = z
  .object({
    id: identifierSchema,
    name: z.string().trim().min(1),
    logo: imagePathSchema,
    url: httpUrlSchema.optional(),
    visible: z.boolean(),
  })
  .strict();

export const networkSchema = z
  .object({ bands: uniqueIdArray(linkedLogoSchema) })
  .strict();
export const collaboratorsSchema = z
  .object({ collaborators: uniqueIdArray(linkedLogoSchema) })
  .strict();
export const siteSchema = z.object({}).strict();

export type Show = z.infer<typeof showSchema>;
export type News = z.infer<typeof newsSchema>;
export type MediaVideo = z.infer<typeof mediaSchema>['videos'][number];
