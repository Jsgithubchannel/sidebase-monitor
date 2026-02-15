// server/api/test.get.ts
import { parseDataAs, z } from '@sidebase/nuxt-parse'

export default defineEventHandler(async () => {
  const schema = z.object({ id: z.number() })
  const data = { id: 123 }

  const validatedData = await parseDataAs(data, schema)

  return {
    success: true,
    validatedData
  }
})
