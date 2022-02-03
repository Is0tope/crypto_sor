import { Event } from 'reconnecting-websocket'
import { MessageEvent } from 'ws'
import { OrderBookAction, OrderBookEvent, PriceLevel } from '.'
import { commonToExchangeSymbol, exchangeToCommonSymbol } from '../lib/symbols'
import { OrderBookFeedHandler } from './OrderBookFeedHandler'
export default class CoinbaseFeedHandler extends OrderBookFeedHandler{
    private symbols: string[]

    constructor(symbols: string[]) {
        super('Coinbase','wss://ws-feed.exchange.coinbase.com')
        this.symbols = symbols
    }

    onOpen(event: Event): void {
        this.subscribe(this.symbols)
    }

    onMessage(event: MessageEvent): void {
        this.translateAndPublishEvent(event)
    }

    subscribe(symbols: string[]) {
        const payload = {
            type: 'subscribe',
            "product_ids": symbols.map((x) => commonToExchangeSymbol(this.getExchange(),x)),
            "channels": [
                "level2"
            ]
        }
        this.ws.send(JSON.stringify(payload))
    }

    translateAndPublishEvent(event: MessageEvent) {
        const msg = JSON.parse(event.data as string)

        const typ = msg.type
        const market = exchangeToCommonSymbol(this.getExchange(),msg.product_id)

        if(typ === 'snapshot') {
            const translatedEvent: OrderBookEvent = {
                action: OrderBookAction.Partial,
                symbol: market,
                bids: msg.bids.map((x: any) => [Number.parseFloat(x[0]),Number.parseFloat(x[1])]),
                asks: msg.asks.map((x: any) => [Number.parseFloat(x[0]),Number.parseFloat(x[1])]),
            }
            this.publish(translatedEvent)
            return
        }
        if(typ === 'l2update') {
            const changes = msg.changes
            const bids: PriceLevel[] = []
            const asks: PriceLevel[] = []

            for(const c of changes) {
                const side = c[0]
                const price = Number.parseFloat(c[1])
                const size = Number.parseFloat(c[2])
                if(side === 'buy') {
                    bids.push([price,size])
                } else {
                    asks.push([price,size])
                }
            }

            const translatedEvent: OrderBookEvent = {
                action: OrderBookAction.Update,
                symbol: market,
                bids: bids,
                asks: asks
            }
            this.publish(translatedEvent)
            return
        }
    }
}