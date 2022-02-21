import { Event } from 'reconnecting-websocket'
import { MessageEvent } from 'ws'
import { OrderBookAction, OrderBookEvent } from '.'
import { OrderBookFeedHandler } from './OrderBookFeedHandler'

export default class MangoFeedHandler extends OrderBookFeedHandler{
    private symbols: string[]

    constructor(symbols: string[]) {
        super('Mango','wss://api.mango-bowl.com/v1/ws')
        this.symbols = symbols
    }

    onOpen(event: Event) {
        const subscribeL2 = {
            op: 'subscribe',
            channel: 'level2',
            markets: this.symbols
        }
        this.ws.send(JSON.stringify(subscribeL2))
    }

    onMessage(event: MessageEvent) {
        this.translateAndPublishEvent(event)
    }


    translateAndPublishEvent(event: MessageEvent) {
        const msg = JSON.parse(event.data as string)

        const typ = msg.type
        const market = msg.market
        // const data = msg.data

        if(!['l2snapshot','l2update'].includes(typ)) return
        if(!this.symbols.includes(market)) return

        const translatedEvent: OrderBookEvent = {
            action: typ === 'l2snapshot' ? OrderBookAction.Partial : OrderBookAction.Update,
            symbol: market,
            bids: msg.bids.map((x: any) => [Number.parseFloat(x[0]),Number.parseFloat(x[1])]),
            asks: msg.asks.map((x: any) => [Number.parseFloat(x[0]),Number.parseFloat(x[1])])
        }
        this.publish(translatedEvent)
    }
}