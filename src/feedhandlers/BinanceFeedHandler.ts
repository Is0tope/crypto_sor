import { OrderBookAction, OrderBookEvent } from '.'
import { Event } from 'reconnecting-websocket'
import WebSocket, { MessageEvent } from 'ws';
import { commonToExchangeSymbol, exchangeToCommonSymbol } from '../symbols'
import { OrderBookFeedHandler } from './OrderBookFeedHandler'

export default class BinanceFeedHandler extends OrderBookFeedHandler{
    private symbols: string[]

    constructor(symbols: string[]) {
        super('Binance','wss://dex.binance.org/api/ws')
        this.symbols = symbols

        this.ws.onopen = ((_event: Event) => {
            this.symbols.map((x) => this.subscribe(x))
        })

        this.ws.onmessage = ((event: MessageEvent) => {
            this.translateAndPublishEvent(event)
        })
    }

    onOpen(event: Event): void {
        
    }

    onMessage(event: WebSocket.MessageEvent): void {
        
    }

    subscribe(symbol: string) {
        this.ws.send(JSON.stringify({
            op: 'subscribe',
            channel: 'orderbook',
            market: commonToExchangeSymbol(this.getExchange(),symbol)}))
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
    }
}