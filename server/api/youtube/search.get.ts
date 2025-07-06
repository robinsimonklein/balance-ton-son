import { z } from 'zod';

const schema = z.object({
  q: z.string(),
});

export default defineEventHandler(async event => {
  const { q } = await getValidatedQuery(event, schema.parse);

  return await searchYoutube(q);
});
