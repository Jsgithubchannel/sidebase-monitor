import { parseDataAs, z } from '@sidebase/nuxt-parse'
import { publicProcedure, router } from '../trpc'

const GitHubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullish(),
  stargazers_count: z.number(),
  html_url: z.string().url(),
})

export const githubRouter = router({
  getStats: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const url = `https://api.github.com/repos/sidebase/${input}`

      console.info(`[Server] Fetching URL: ${url}`)

      try {
        const data = await $fetch(url, {
          headers: {
            'User-Agent': 'sidebase-dashboard-v1'
          }
        })

        console.info(`[Server] Data received for ${input}`)

        return await parseDataAs(data, GitHubRepoSchema)
      }
      catch (error) {
        console.error(`[Server Error] Failed to fetch ${input}:`, error)
        throw error
      }
    }),
})
