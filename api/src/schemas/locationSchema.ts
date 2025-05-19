import { z } from 'zod';

export const locationSchema = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
});
