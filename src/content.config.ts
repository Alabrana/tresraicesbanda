import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { newsSchema, showSchema } from './lib/contracts';

const news = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/news' }),
  schema: newsSchema,
});

const shows = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/shows' }),
  schema: showSchema,
});

export const collections = { news, shows };
