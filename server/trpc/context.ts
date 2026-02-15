import type { inferAsyncReturnType } from '@trpc/server'
import type { H3Event } from 'h3'

export async function createContext(event: H3Event) {
  return {
    prisma: event.context.prisma,
    event,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
