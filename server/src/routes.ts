import { EXCHANGES, MARKET_MAPPING, SYMBOLS } from './symbols'
import { FastifyReply, FastifyRequest } from 'fastify'
import { SOR } from './app'
import { Side } from './common'

const symbolsHandler = async (req: FastifyRequest, res: FastifyReply) => {
    return {
        'exchanges': EXCHANGES,
        'symbols': SYMBOLS,
        'mapping': MARKET_MAPPING
    }
}

const bookHandler = async (req: FastifyRequest, res: FastifyReply) => {
    const symbol = (req.params as any)['*'] as string
    const levels = (req.query as any).levels || 10

    const bids = SOR.getBids(symbol).slice(0,levels)
    const asks = SOR.getAsks(symbol).slice(0,levels)

    res.code(200)
        .header('Content-Type', 'application/json')
        .send({
            bids,
            asks
        })
}

const newOrderHandler = async (req: FastifyRequest, res: FastifyReply) => {
    const body: any = req.body
    const symbol: string = body.symbol
    const orderQty: number = body.orderQty
    const side = body.side === 'Buy' ? Side.Buy : Side.Sell

    const execs = SOR.newOrder(symbol,side,orderQty)

    res.code(200)
        .header('Content-Type', 'application/json')
        .send(execs)
}

export default [
    {
        method: 'GET',
        url: '/api/symbols',
        handler: symbolsHandler
    },
    {
        method: 'GET',
        url: '/api/book/*',
        schema: {
            params: {
                '*': { type: 'string', enum: SYMBOLS}
            },
            query: {
                levels: { type: 'integer', exclusiveMinimum: 0, maximum: 50 }
            }
        },
        handler: bookHandler
    },
    {
        method: 'POST',
        url: '/api/order',
        schema: {
            body: {
                type: 'object',
                required: ['symbol','orderQty','side'],
                properties: {
                    symbol: { type: 'string', enum: SYMBOLS },
                    orderQty: { type: 'number', exclusiveMinimum: 0 },
                    side: { type: 'string', enum: ['Buy', 'Sell'] }
                }
            }
        },
        handler: newOrderHandler
    }
]