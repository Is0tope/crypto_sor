import { EXCHANGES, INSTRUMENTS, SYMBOLS } from './lib/symbols'
import { FastifyReply, FastifyRequest } from 'fastify'
import { SOR } from './app'
import { Side } from './lib/common'
import { PriceLevel } from './lib/CompositeOrderBook'
import logger from './logger'

const symbolsHandler = async (req: FastifyRequest, res: FastifyReply) => {
    return {
        'exchanges': EXCHANGES,
        'symbols': SYMBOLS,
        'instruments': INSTRUMENTS
    }
}

const bookHandler = async (req: FastifyRequest, res: FastifyReply) => {
    const symbol = (req.params as any)['*'] as string
    const levels = (req.query as any).levels || 10
    const exchanges = (req.query as any).exchanges as string

    let bids = SOR.getBids(symbol)
    let asks = SOR.getAsks(symbol)

    if(exchanges !== undefined) {
        const includeExchanges = exchanges.split(',')
        bids = bids.filter((l: PriceLevel) => includeExchanges.includes(l.exchange))
        asks = asks.filter((l: PriceLevel) => includeExchanges.includes(l.exchange))
    }

    bids = bids.slice(0,levels)
    asks = asks.slice(0,levels)

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
    logger.info(`${Side[side]} ${symbol} ${orderQty.toLocaleString(undefined,{maximumFractionDigits: 2})}: ${execs.length} fills`)
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
                levels: { type: 'integer', exclusiveMinimum: 0, maximum: 50 },
                // This should be type='array' however I cannot for 
                // the life of me figure out what the array format is
                exchanges: { 
                    type: 'string'
                }
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