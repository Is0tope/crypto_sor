import { OrderBookAction, OrderBookEvent, OrderBookFeedHandler, PriceLevel } from '.'
import ReconnectingWebSocket, { Event } from 'reconnecting-websocket'
import WebSocket, { MessageEvent } from 'ws';
import { commonToExchangeSymbol } from '../symbols'

export default class CoinbaseFeedHandler implements OrderBookFeedHandler{
    private exchange = 'Coinbase'
    private url = 'wss://ws-feed.exchange.coinbase.com'
    private symbols: string[]
    private ws: ReconnectingWebSocket
    private eventHandlers: ((event: OrderBookEvent) => void)[]

    constructor(symbols: string[]) {
        this.symbols = symbols
        this.eventHandlers = []
        this.ws = new ReconnectingWebSocket(this.url, [],  {
            WebSocket: WebSocket
        })

        this.ws.onopen = ((_event: Event) => {
            this.subscribe(this.symbols)
        })

        this.ws.onmessage = ((event: MessageEvent) => {
            this.translateAndPublishEvent(event)
        })
    }

    getExchange(): string { return this.exchange }

    subscribe(symbols: string[]) {
        const payload = {
            type: 'subscribe',
            "product_ids": this.symbols.map((x) => commonToExchangeSymbol(this.exchange,x)),
            "channels": [
                "level2"
            ]
        }
        this.ws.send(JSON.stringify(payload))
    }

    translateAndPublishEvent(event: MessageEvent) {
        const msg = JSON.parse(event.data as string)

        const typ = msg.type
        const market = msg.product_id

        if(typ === 'snapshot') {
            const translatedEvent: OrderBookEvent = {
                action: OrderBookAction.Partial,
                symbol: market,
                bids: msg.bids,
                asks: msg.asks
            }
            this.eventHandlers.map((fn) => fn(translatedEvent))
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
            this.eventHandlers.map((fn) => fn(translatedEvent))
            return
        }
    }

    onEvent(fn: (event: OrderBookEvent) => void): void {
        this.eventHandlers.push(fn)
    }

}