import fastify from 'fastify'
import routes from './routes'
import { SOR } from './app'
import cors from 'fastify-cors'
import prettifier from '@mgcrea/pino-pretty-compact'
import fastifyRequestLogger from '@mgcrea/fastify-request-logger'

const PORT = process.env.PORT || 8080
const VACUUM_INTERVAL = 10_000
const RECONNECT_INTERVAL = 30 * 60_000

const server = fastify({
  disableRequestLogging: true,
  logger: {
    prettyPrint: true,
    prettifier,
  },
})

server.register(cors)
server.register(fastifyRequestLogger)

routes.forEach((r: any) => server.route(r))

server.listen(PORT, '0.0.0.0', (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
})

setInterval(() => {
  SOR.vacuum()
}, VACUUM_INTERVAL)

setInterval(() => {
  SOR.reconnect()
}, RECONNECT_INTERVAL)
