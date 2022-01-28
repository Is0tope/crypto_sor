import { MaxPriorityQueue } from '@datastructures-js/priority-queue';
import { OrderBookAction, OrderBookEvent } from './feedhandlers'

export enum Side {
    Buy,
    Sell
}

export interface PriceLevel {
    exchange: string
    side: Side
    price: number
    size: number
}

export interface NewOrderArgs {
    price?: number
    size: number
    side: Side
}

export interface Execution {
    exchange: string
    side: Side
    lastPrice: number
    lastSize: number
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

    // newOrder(args: NewOrderArgs): Execution[] {
    //     // Create the order
    //     const level: PriceLevel = {
    //         price: args.price || (args.side === Side.Buy ? Infinity : -Infinity),
    //         size: args.size,
    //         side: args.side,
    //         ordType: args.ordType,
    //         timestamp: this.clock.getTime()
    //     }
    //     const isBuy = level.side === Side.Buy
    //     const aggressive = isBuy ? level.price >= this.bestAsk() : level.price <= this.bestBid()
    //     const executions: Execution[] = []

    //     // If we are aggressive, match against opposite side
    //     const oppositeSide = isBuy ? this.asks : this.bids
    //     if(aggressive && !oppositeSide.isEmpty()){
    //         let oppositeOrder = <Order>oppositeSide.front()
    //         while(  level.size > 0 && 
    //                 (isBuy ? oppositeOrder.price <= level.price : oppositeOrder.price >= level.price) && 
    //                 !oppositeSide.isEmpty()
    //         ){
    //             executions.push(...this.trade(level,oppositeOrder,this.clock.getTime()))
    //             if(oppositeOrder.size === 0){
    //                 oppositeSide.dequeue()
    //                 if(oppositeSide.isEmpty()) break
    //                 oppositeOrder = <Order>oppositeSide.front()
    //             }
    //         }
    //     }

    //     // If this is a market order, cancel any remaining quanity (if any)
    //     if(level.ordType === OrderType.Market && level.size > 0) {
    //         level.size = 0
    //     }

    //     // If any quantity remaining, put the remainder in passively
    //     if(level.size > 0){
    //         isBuy ? this.bids.enqueue(level) : this.asks.enqueue(level)
    //     }
        
    //     // Publish trades (buy only) to subscribers
    //     const trades = executions.filter((e: Execution) => e.side === Side.Buy)
    //     if(trades.length > 0){
    //         this.tradeSubscribers.forEach((fn: (es: Execution[]) => void) => {
    //             fn(trades)
    //         })
    //     }

    //     return executions
    // }

    // private trade(agg: Order, pass: Order, timestamp: number): Execution[] {
    //     const execs: Execution[] = []
    //     const qty = Math.min(agg.size,pass.size)
    //     execs.push({
    //         timestamp: timestamp,
    //         lastPrice: pass.price,
    //         lastSize: qty,
    //         side: agg.side
    //     })
    //     execs.push({
    //         timestamp: timestamp,
    //         lastPrice: pass.price,
    //         lastSize: qty,
    //         side: pass.side
    //     })
    //     agg.size -= qty
    //     pass.size -= qty
    //     return execs
    // }

    print() {
        for(const o of this.asks.toArray().reverse().slice(0,10)){
            console.log(o)
        }
        console.log('-----------')
        for(const o of this.bids.toArray().slice(0,10)){
            console.log(o)
        }
        console.log('')
    }

    // getBidL2(): Map<number,number> {
    //     const bidDict = new Map<number,number>()
    //     for(let o of this.bids.toArray()){
    //         o = <Order>o
    //         let size = bidDict.has(o.price) ? bidDict.get(o.price)! + o.size : o.size
    //         bidDict.set(o.price,size)
    //     }
    //     return bidDict
    // }

    // getAskL2(): Map<number,number> {
    //     const askDict = new Map<number,number>()
    //     for(let o of this.asks.toArray()){
    //         o = <Order>o
    //         let size = askDict.has(o.price) ? askDict.get(o.price)! + o.size : o.size
    //         askDict.set(o.price,size)
    //     }
    //     return askDict
    // }

    // printL2() {
    //     const bidDict = this.getBidL2()
    //     const askDict = this.getAskL2()
    //     for(const a of Array.from(askDict.keys()).sort().reverse()) {
    //         console.log(`${a}\t${askDict.get(a)?.toLocaleString()}`)
    //     }
    //     console.log('------------------------')
    //     for(const b of Array.from(bidDict.keys()).sort().reverse()) {
    //         console.log(`${b}\t${bidDict.get(b)?.toLocaleString()}`)
    //     }
    // }
}