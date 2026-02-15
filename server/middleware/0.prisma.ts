import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient | undefined

export default defineEventHandler((event) => {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  event.context.prisma = prisma
})
