import fastify from 'fastify'
import routes from './routes'
import { SOR } from './app'

const PORT = process.env.PORT || 8080
const VACUUM_INTERVAL = 10_000

const server = fastify({
    logger: {
        prettyPrint: {
            translateTime: true,
            // ignore: 'pid,hostname,reqId,responseTime',
            // messageFormat: '{msg} {req.method} {req.url} {res.statusCode}',
            
        }
    }
})

routes.forEach((r: any) => server.route(r))

server.listen(PORT, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
})

setInterval(() => {
    SOR.vacuum()
}, VACUUM_INTERVAL)