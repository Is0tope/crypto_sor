import { MaxPriorityQueue } from '@datastructures-js/priority-queue';
import { Side } from './common'
import { OrderBookAction, OrderBookEvent } from '../feedhandlers'
import logger from '../logger'

export interface PriceLevel {
    exchange: string
    side: Side
    price: number
    size: number
}

export interface Execution {
    exchange: string
    symbol: string
    side: Side
    lastPrice: number
    lastQty: number
}

function priceLevelComparator(a: PriceLevel, b: PriceLevel): number {
    // Assume that we only ever compare orders on same side
    const priceDiff = b.price - a.price
    // Ignore time priority for simplicity
    return a.side === Side.Buy ? priceDiff : -priceDiff
}

export class CompositeOrderBook {
    private bids = new MaxPriorityQueue({ compare: priceLevelComparator})
    private asks = new MaxPriorityQueue({ compare: priceLevelComparator})
    private levelLookup: Map<string,PriceLevel> = new Map();
    private symbol: string

    constructor(symbol: string) {
        this.symbol = symbol
    }

    levelKey(exchange: string, side: Side, price: number): string {
        return `${exchange}|${side}|${price}`
    }

    bestBid(): number {
        if(this.bids.isEmpty()) return -Infinity
        return (<PriceLevel>this.bids.front()).price
    }

    bestAsk(): number {
        if(this.asks.isEmpty()) return Infinity
        return (<PriceLevel>this.asks.front()).price
    }

    getSymbol(): string {
        return this.symbol
    }

    updateLevel(exchange: string, side: Side, price: number, size: number) {
        // See if level already exists
        const key = this.levelKey(exchange, side, price)
        let level = this.levelLookup.get(key)
        if(level === undefined) {
            level = {
                exchange,
                side,
                price,
                size
            }
            this.levelLookup.set(key,level)
            const queue = side === Side.Buy ? this.bids : this.asks
            queue.enqueue(level)
        } else {
            level.size = size
        }
    }

    processExternalOrderBookEvent(exchange: string, event: OrderBookEvent) {
        const action = event.action
        const symbol = event.symbol
        if(action === OrderBookAction.Partial) {
            // Clear out all levels for this exchange
            this.vacuum((l: PriceLevel) => l.exchange === exchange)
        }
        for(const b of event.bids) {
            this.updateLevel(exchange, Side.Buy, b[0], b[1])
        }
        for(const a of event.asks) {
            this.updateLevel(exchange, Side.Sell, a[0], a[1])
        }
    }

    vacuum(removeFilter?: ((l: PriceLevel) => boolean)) {
        // Due to the priority queue having no easy removal, this quite inefficient method is required
        // to periodically clean up any empty price levels
        logger.info(`Vacuuming book for ${this.symbol}`)
        
        if(removeFilter === undefined) {
            removeFilter = (l: PriceLevel) => l.size === 0 
        }

        this.levelLookup.clear()

        const bids = (<PriceLevel[]>this.bids.toArray()).filter((x: PriceLevel) => !removeFilter!(x))
        this.bids.clear()
        bids.forEach((b: PriceLevel) => this.updateLevel(b.exchange,b.side,b.price,b.size))

        const asks = (<PriceLevel[]>this.asks.toArray()).filter((x: PriceLevel) => !removeFilter!(x))
        this.asks.clear()
        asks.forEach((a: PriceLevel) => this.updateLevel(a.exchange,a.side,a.price,a.size))
    }

    newOrder(side: Side, orderQty: number, exchanges?: string[]): Execution[] {
        const queue: PriceLevel[] = side === Side.Buy ? <PriceLevel[]>this.asks.toArray() : <PriceLevel[]>this.bids.toArray()
        let cumQty = 0
        const executions: Execution[] = []
        for(const level of queue) {
            if(level.size === 0) continue
            if(exchanges) {
                if(!exchanges.includes(level.exchange)) continue
            }
            if(cumQty === orderQty) break
            const remaining = orderQty - cumQty
            const lastQty = Math.min(remaining,level.size)
            executions.push({
                exchange: level.exchange,
                symbol: this.symbol,
                side: side,
                lastPrice: level.price,
                lastQty: lastQty
            })
            cumQty += lastQty
        }
        return executions
    }

    print() {
        for(const o of this.asks.toArray().slice(0,10).reverse()){
            console.log(o)
        }
        console.log('-----------')
        for(const o of this.bids.toArray().slice(0,10)){
            console.log(o)
        }
        console.log('')
    }

    getBids(removeEmpty?: boolean): PriceLevel[] {
        let res = <PriceLevel[]>this.bids.toArray()
        if(removeEmpty) {
            res = res.filter((l: PriceLevel) => l.size !== 0)
        }
        return res
    }

    getAsks(removeEmpty?: boolean): PriceLevel[] {
        let res = <PriceLevel[]>this.asks.toArray()
        if(removeEmpty) {
            res = res.filter((l: PriceLevel) => l.size !== 0)
        }
        return res
    }
}