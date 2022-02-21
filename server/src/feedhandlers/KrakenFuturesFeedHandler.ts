import { Event } from 'reconnecting-websocket'
import { MessageEvent } from 'ws'
import { OrderBookAction, OrderBookEvent } from '.'
import { commonToExchangeSymbol, exchangeToCommonSymbol } from '../lib/symbols'
import { OrderBookFeedHandler } from './OrderBookFeedHandler'

export default class KrakenFuturesFeedHandler extends OrderBookFeedHandler{
    private symbols: string[]

    constructor(symbols: string[]) {
        super('Kraken','wss://futures.kraken.com/ws/v1')
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
            product_ids: this.symbols.map((x: string) => commonToExchangeSymbol(this.getExchange(),x)),
            feed: 'book'
        }
        this.ws.send(JSON.stringify(payload))
    }

    translateAndPublishEvent(event: MessageEvent) {
        const msg = JSON.parse(event.data as string)
        if('event' in msg) return
        if(!['book_snapshot','book'].includes(msg.feed)) return
        const action = msg.feed === 'book_snapshot' ? OrderBookAction.Partial : OrderBookAction.Update
        const symbol = exchangeToCommonSymbol(this.getExchange(),msg.product_id)

        const translatedEvent: OrderBookEvent = {
            action: action,
            symbol: symbol,
            bids: [],
            asks: []
        }
        
        if(action === OrderBookAction.Partial){
            translatedEvent.bids = msg.bids.map((x: any) => [x.price,x.qty])
            translatedEvent.asks = msg.asks.map((x: any) => [x.price,x.qty])
        }

        if(action === OrderBookAction.Update){
            if(msg.side === 'sell'){
                translatedEvent.asks.push([msg.price,msg.qty])
            } else {
                translatedEvent.bids.push([msg.price,msg.qty])
            }
        }

        this.publish(translatedEvent)
    }
}