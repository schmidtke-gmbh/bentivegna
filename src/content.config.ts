import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const artikel = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artikel' }),
  schema: z.object({
    titel: z.string(),
    url: z.string().optional(),
    teil: z.number(),
    kapitel: z.string(),
    lead: z.string().optional().default(''),
    datum: z.coerce.date(),
    entwurf: z.boolean().optional().default(false),
    bild: z.string().optional().default(''),
    bild_alt: z.string().optional().default(''),
    aufgabe: z.string().optional().default(''),
    aufgabe_vor_ausblick: z.boolean().optional().default(true),
    lesezeit: z.number().optional(),
    meta_titel: z.string().optional().default(''),
    meta_beschreibung: z.string().optional().default(''),
    suchbegriff: z.string().optional().default(''),
    audio: z.string().optional().default('')
  })
});

const kapitel = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/kapitel' }),
  schema: z.object({
    nummer: z.number(),
    titel: z.string(),
    beschreibung: z.string().optional().default('')
  })
});

const stellen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stellen' }),
  schema: z.object({
    titel: z.string(),
    reihenfolge: z.number().optional().default(1),
    aktiv: z.boolean().optional().default(true),
    umfang: z.string().optional().default('Vollzeit / Teilzeit'),
    ort: z.string().optional().default('Überlingen'),
    arbeitsmodell: z.string().optional().default('vor Ort, Homeoffice, Hybrid'),
    start: z.string().optional().default('ab sofort'),
    aufgaben: z.array(z.string()).default([]),
    anforderungen: z.array(z.string()).default([]),
    profil_pdf: z.string().optional().default(''),
    datum: z.coerce.date().optional()
  })
});

export const collections = { artikel, kapitel, stellen };
