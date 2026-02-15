import { parseDataAs, z } from '@sidebase/nuxt-parse' // 이제 여기서 z와 parse를 가져올 수 있습니다.
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
      // API 주소 확인: 입력값이 'nuxt-auth'라면 -> https://api.github.com/repos/sidebase/nuxt-auth 가 됩니다.
      const url = `https://api.github.com/repos/sidebase/${input}`

      console.info(`[Server] Fetching URL: ${url}`) // 1. URL이 제대로 찍히는지 확인

      try {
        const data = await $fetch(url, {
          headers: {
            // GitHub API는 User-Agent가 없으면 403 에러를 뱉습니다.
            'User-Agent': 'sidebase-dashboard-v1'
          }
        })

        console.info(`[Server] Data received for ${input}`) // 2. 데이터 도착 확인

        return await parseDataAs(data, GitHubRepoSchema)
      }
      catch (error) {
        // 3. 여기서 진짜 범인이 잡힙니다!
        console.error(`[Server Error] Failed to fetch ${input}:`, error)
        throw error
      }
    }),
})
