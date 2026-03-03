import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const workshop = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/workshop' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
  }),
});

export const collections = { workshop };
