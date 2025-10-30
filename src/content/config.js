import { defineCollection, z } from 'astro:content'

const nav = defineCollection({
  type: 'data',
  schema: z.object({
    url: z.string(),
    aliases: z.array(z.string()).min(1),
    external: z.boolean().optional().default(false),
    order: z.number().optional(),
  }),
})

export const collections = { nav }
