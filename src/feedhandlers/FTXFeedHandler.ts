import { OrderBookAction, OrderBookEvent, OrderBookFeedHandler } from '.'
import ReconnectingWebSocket, { Event } from 'reconnecting-websocket'
import WebSocket, { MessageEvent } from 'ws';
import { commonToExchangeSymbol, exchangeToCommonSymbol } from '../symbols'

export default class FTXFeedHandler implements OrderBookFeedHandler{
    private exchange = 'FTX'
    private url = 'wss://ftx.com/ws/'
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
            this.symbols.map((x) => this.subscribe(x))
        })

        this.ws.onmessage = ((event: MessageEvent) => {
            this.translateAndPublishEvent(event)
        })
    }

    getExchange(): string { return this.exchange }

    subscribe(symbol: string) {
        this.ws.send(JSON.stringify({
            op: 'subscribe',
            channel: 'orderbook',
            market: commonToExchangeSymbol(this.exchange,symbol)}))
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
            symbol: exchangeToCommonSymbol(this.exchange,market),
            bids: data.bids,
            asks: data.asks
        }
        this.eventHandlers.map((fn) => fn(translatedEvent))
    }

    onEvent(fn: (event: OrderBookEvent) => void): void {
        this.eventHandlers.push(fn)
    }

}