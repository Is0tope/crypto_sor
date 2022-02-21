import { Event } from 'reconnecting-websocket'
import { MessageEvent } from 'ws'
import { OrderBookAction, OrderBookEvent } from '.'
import { commonToExchangeSymbol, exchangeToCommonSymbol, getCommonSymbolType, getContractSize, InstrumentType } from '../lib/symbols'
import logger from '../logger'
import { OrderBookFeedHandler } from './OrderBookFeedHandler'
import pako from 'pako';


export default class OKXFeedHandler extends OrderBookFeedHandler{
    private symbols: string[]

    constructor(symbols: string[]) {
        super('OKX','wss://real.okex.com:8443/ws/v3')
        this.symbols = symbols
    }

    onOpen(event: Event) {
        const payload = {
            op: 'subscribe', 
            args: this.symbols.map((s: string) => {
                const typ = getCommonSymbolType(s)
                const tag = typ === InstrumentType.Spot ? 'spot' : 'swap'
                return `${tag}/depth:${commonToExchangeSymbol(this.getExchange(),s)}`
            })
        }
        this.ws.send(JSON.stringify(payload))
    }

    onMessage(event: MessageEvent) {
        this.translateAndPublishEvent(event)
    }

    translateAndPublishEvent(event: MessageEvent) {
        // For OKX need to delate message
        const deflated = pako.inflateRaw(event.data as any, { to: 'string' });
        if (!deflated) {
          logger.info('[OKX] empty payload, skipping...')
          return
        }
        const msg = JSON.parse(deflated as string)

        const action = msg.action
        const dataList = msg.data

        if(!['partial','update'].includes(action)) return

        for(const data of dataList){
            const exSymbol = data.instrument_id
            const symbol = exchangeToCommonSymbol(this.getExchange(),exSymbol)
            if(!symbol) {
                logger.error(`Unable to translate ${exSymbol} for ${this.getExchange()}`)
                continue
            }
            // TODO: Should be sourced from exchange, and applied more selectively
            const contractVal = getContractSize(this.getExchange(),symbol)
            const translatedEvent: OrderBookEvent = {
                action: action === 'partial' ? OrderBookAction.Partial : OrderBookAction.Update,
                symbol: symbol,
                bids: data.bids.map((x: any) => [Number.parseFloat(x[0]),Number.parseFloat(x[1])/contractVal]),
                asks: data.asks.map((x: any) => [Number.parseFloat(x[0]),Number.parseFloat(x[1])/contractVal])
            }
            this.publish(translatedEvent)
        }
    }
}