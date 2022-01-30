import { EXCHANGES, MARKET_MAPPING, SYMBOLS } from './symbols'
import { FastifyReply, FastifyRequest } from 'fastify'
import { SOR } from './app'

const symbolsHandler = async (req: FastifyRequest, res: FastifyReply) => {
    return {
        'exchanges': EXCHANGES,
        'symbols': SYMBOLS,
        'mapping': MARKET_MAPPING
    }
}

const newOrderHandler = async (req: FastifyRequest, res: FastifyReply) => {
    const body = req.body
    res.code(201)
        .header('Content-Type', 'application/json')
        .send(body)
}

export default [
    {
        method: 'GET',
        url: '/api/symbols',
        handler: symbolsHandler
    },
    {
        method: 'POST',
        url: '/api/order',
        schema: {
            body: {
                type: 'object',
                required: ['symbol','orderQty','side'],
                properties: {
                    symbol: { type: 'string' },
                    orderQty: { type: 'number', exclusiveMinimum: 0 },
                    side: { type: 'string', enum: ['Buy', 'Sell'] }
                }
            }
        },
        handler: newOrderHandler
    }
]