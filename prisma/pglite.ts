/**
 * Script that starts a postgres database using pg-gateway (https://github.com/supabase-community/pg-gateway) and pglite (https://github.com/electric-sql/pglite).
 *
 * We use this database for local development with prisma ORM. The script also supports creating a `shadow-database`, which is a second, separate database
 * that prisma uses for certain commands, such as `pnpm prisma migrate dev`: https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/shadow-database.
 *
 * To make use of the shadow-database add `/prisma-shadow` to the DSN you provide. This script will then spin up a second, in-memory-only database and connect you to it.
 */
import { unlinkSync, writeFileSync } from 'node:fs'
import net from 'node:net'
import { PGlite } from '@electric-sql/pglite'
import { join } from 'pathe'
import { fromNodeSocket } from 'pg-gateway/node'

// If env var is set, we write a file to disk once the server is done starting up. This file can then be used by other processes to check whether the database is ready
const doWriteHealthFile = process.env.WRITE_HEALTH_FILE === 'true'
const HEALTH_FILE_NAME = 'pgliteHealthz'

const db = new PGlite({ dataDir: join(import.meta.dirname, 'pglite-data') })
let activeDb = db

const server = net.createServer(async (socket) => {
  activeDb = db

  console.info(`Client connected: ${socket.remoteAddress}:${socket.remotePort}`)
  await fromNodeSocket(socket, {
    serverVersion: '16.3',

    auth: {
      // No password required
      method: 'trust',
    },

    async onStartup({ clientParams }) {
      // create a temp in-memory instance if connecting to the prisma shadow DB
      if (clientParams?.database === 'prisma-shadow') {
        console.info('Connecting client to shadow database')
        activeDb = new PGlite()
      }

      // Wait for PGlite to be ready before further processing
      await activeDb.waitReady
    },

    // Hook into each client message
    async onMessage(data, { isAuthenticated }) {
      // Only forward messages to PGlite after authentication
      if (!isAuthenticated) {
        return
      }

      // Forward raw message to PGlite and send response to client
      return await activeDb.execProtocolRaw(data)
    },
  })

  socket.on('end', () => {
    console.info('Client disconnected')
  })
})

server.listen(5432, () => {
  if (doWriteHealthFile) {
    writeFileSync(HEALTH_FILE_NAME, '')
  }

  console.info('Server listening on port 5432')
})

server.on('close', () => {
  if (doWriteHealthFile) {
    unlinkSync(HEALTH_FILE_NAME)
  }
})
