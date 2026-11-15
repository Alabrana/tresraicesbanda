import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const imagePath = z
  .string()
  .startsWith('/images/')
  .refine(
    (value) => existsSync(join(process.cwd(), 'public', value)),
    'La imagen referenciada no existe en public/images.',
  );

const news = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/news' }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    summary: z.string().min(1),
    cover: imagePath,
    images: z.array(imagePath).optional(),
  }),
});

const shows = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/shows' }),
  schema: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().regex(/^\d{2}:\d{2}$/),
    venue: z.string().min(1),
    city: z.string().min(1),
    address: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    poster: imagePath,
    guestBands: z.array(z.string().min(1)).optional(),
    ticketUrl: z.url().optional(),
    status: z.enum(['scheduled', 'cancelled', 'rescheduled']),
    visible: z.boolean(),
  }),
});

export const collections = { news, shows };
