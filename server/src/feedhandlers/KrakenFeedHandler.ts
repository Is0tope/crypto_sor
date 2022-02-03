import { OrderBookAction, OrderBookEvent } from '.'
import ReconnectingWebSocket, { Event } from 'reconnecting-websocket'
import WebSocket, { MessageEvent } from 'ws';
import { commonToExchangeSymbol, exchangeToCommonSymbol } from '../lib/symbols'
import { OrderBookFeedHandler } from './OrderBookFeedHandler'

export default class KrakenFeedHandler extends OrderBookFeedHandler{
    private symbols: string[]
    private counter = 0

    constructor(symbols: string[]) {
        super('Kraken','wss://ws.kraken.com')
        this.symbols = symbols
    }

    onOpen(event: Event) {
        this.symbols.map((x) => this.subscribe(x))
    }

    onMessage(event: MessageEvent) {
        this.translateAndPublishEvent(event)
    }

    subscribe(symbol: string) {
        const payload = {
            event: 'subscribe',
            pair: this.symbols.map((x: string) => commonToExchangeSymbol(this.getExchange(),x)),
            subscription: {
              name: 'book',
              depth: 1000
            }
          }
        this.ws.send(JSON.stringify(payload))
        this.counter = 0
    }

    translateAndPublishEvent(event: MessageEvent) {
        const msg = JSON.parse(event.data as string)
        if(!Array.isArray(msg)) return

        const symbol = exchangeToCommonSymbol(this.getExchange(),msg[msg.length-1])

        // First message is the State Of World, others are updates
        if(this.counter === 0 ) {
            const data = msg[1]
            const bids = data.bs.map((x: any) => [Number.parseFloat(x[0]),Number.parseFloat(x[1])])
            const asks = data.as.map((x: any) => [Number.parseFloat(x[0]),Number.parseFloat(x[1])])
            const translatedEvent: OrderBookEvent = {
                action: OrderBookAction.Partial,
                symbol: symbol,
                bids: bids,
                asks: asks
            }
            this.publish(translatedEvent)
        } else {
            const dataList = msg.slice(1,-2)
            if(dataList.length > 1) { console.log(dataList) }
            for(const data of dataList){
                const bids = 'b' in data ? data.b.map((x: any) => [Number.parseFloat(x[0]),Number.parseFloat(x[1])]) : []
                const asks = 'a' in data ? data.a.map((x: any) => [Number.parseFloat(x[0]),Number.parseFloat(x[1])]) : []
                const translatedEvent: OrderBookEvent = {
                    action: OrderBookAction.Update,
                    symbol: symbol,
                    bids: bids,
                    asks: asks
                }
                this.publish(translatedEvent)
            }
        }

        this.counter++
    }
}