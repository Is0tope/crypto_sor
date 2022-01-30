import pino from 'pino'

export default pino({
    prettyPrint: {
        translateTime: true,
        ignore: 'pid,hostname,remotePort'
    }
})