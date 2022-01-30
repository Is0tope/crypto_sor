import { OrderBookAction, OrderBookEvent } from '.'
import ReconnectingWebSocket, { Event } from 'reconnecting-websocket'
import WebSocket, { MessageEvent } from 'ws';
import { commonToExchangeSymbol, exchangeToCommonSymbol } from '../lib/symbols'
import { OrderBookFeedHandler } from './OrderBookFeedHandler'

export default class FTXFeedHandler extends OrderBookFeedHandler{
    private symbols: string[]

    constructor(symbols: string[]) {
        super('FTX','wss://ftx.com/ws/')
        this.symbols = symbols
    }

    onOpen(event: Event) {
        this.symbols.map((x) => this.subscribe(x))
    }

    onMessage(event: MessageEvent) {
        this.translateAndPublishEvent(event)
    }

    subscribe(symbol: string) {
        this.ws.send(JSON.stringify({
            op: 'subscribe',
            channel: 'orderbook',
            market: commonToExchangeSymbol(this.getExchange(),symbol)
        }))
    }

    translateAndPublishEvent(event: MessageEvent) {
        const msg = JSON.parse(event.data as string)

        const typ = msg.type
        const channel = msg.channel
        const market = msg.market
        const data = msg.data

        if(channel != 'orderbook') return
        if(!['partial','update'].includes(typ)) return
        if(!this.symbols.includes(market)) return

        const translatedEvent: OrderBookEvent = {
            action: typ === 'partial' ? OrderBookAction.Partial : OrderBookAction.Update,
            symbol: exchangeToCommonSymbol(this.getExchange(),market),
            bids: data.bids,
            asks: data.asks
        }
        this.publish(translatedEvent)
    }
}