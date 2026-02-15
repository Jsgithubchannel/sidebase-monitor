import { router } from '~~/server/trpc/trpc'
import { githubRouter } from '../../../trpc/routers/github'

export const appRouter = router({
  github: githubRouter,
})

export type AppRouter = typeof appRouter
