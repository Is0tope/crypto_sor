import axios from 'axios'
import { Event } from 'reconnecting-websocket'
import { MessageEvent } from 'ws'
import { OrderBookAction, OrderBookEvent } from '.'
import { commonToExchangeSymbol, exchangeToCommonSymbol } from '../lib/symbols'
import logger from '../logger'
import { OrderBookFeedHandler } from './OrderBookFeedHandler'

export default class BinanceFeedHandler extends OrderBookFeedHandler{
    private symbols: string[]
    private msgBuffer: Map<string,any[]>
    private hasReceivedSOW: Set<String>

    constructor(symbols: string[]) {
        super('Binance','wss://stream.binance.com:9443/stream')
        this.symbols = symbols
        this.msgBuffer = new Map()
        this.hasReceivedSOW = new Set()
    }

    resetBuffers() {
        this.msgBuffer.clear()
        for(const s of this.symbols) {
            this.msgBuffer.set(s,[])
        }
        this.hasReceivedSOW.clear()
    }

    getMessagesAfterUpdateId(symbol: string, lastUpdateId: number): any[] {
        // From https://binance-docs.github.io/apidocs/spot/en/#diff-depth-stream
        const msgs = this.msgBuffer.get(symbol)
        const idx = msgs!.findIndex((x: any) => {
            const { U, u } = x
            return U <= lastUpdateId + 1 && u >= lastUpdateId + 1
        })
        if(idx == -1) {
            return []
        }
        return msgs!.slice(idx)
    }

    onOpen(event: Event): void {
        // Clear out state structures
        this.resetBuffers()
        // Subscribe to each symbol
        const payload = JSON.stringify({ 
            id: 1,
            method: "SUBSCRIBE",
            params: this.symbols.map((x: string) => `${commonToExchangeSymbol(this.getExchange(),x).toLowerCase()}@depth`)
        })
        this.ws.send(payload)
        setTimeout(async () => {
            for(const s of this.symbols) {
                const exchSym = commonToExchangeSymbol(this.getExchange(),s)
                const response = await axios.get(`https://api.binance.com/api/v3/depth?symbol=${exchSym}&limit=1000`)
                const data = response.data

                const partial: OrderBookEvent = {
                    action: OrderBookAction.Partial,
                    symbol: s,
                    bids: data.bids.map((x: any) => [Number.parseFloat(x[0]),Number.parseFloat(x[1])]),
                    asks: data.asks.map((x: any) => [Number.parseFloat(x[0]),Number.parseFloat(x[1])])
                }
                this.publish(partial)
                const lastUpdateId = data.lastUpdateId
                logger.info(`[${this.getExchange()}] Got SOW for ${s} with lastUpdateId=${lastUpdateId}`)
                const msgs = this.getMessagesAfterUpdateId(s,lastUpdateId)
                if(msgs.length > 0) {
                    logger.info(`[${this.getExchange()}] Replaying ${msgs.length} messages`)
                    for(const m of msgs) {
                        this.publish(this.processUpdateMessage(m))
                    }
                }
                this.hasReceivedSOW.add(s)
            }
        },2000)
    }

    processUpdateMessage(msg: any): OrderBookEvent {
        return {
            action: OrderBookAction.Update,
            symbol: exchangeToCommonSymbol(this.getExchange(),msg.s),
            bids: msg.b.map((x: any) => [Number.parseFloat(x[0]),Number.parseFloat(x[1])]),
            asks: msg.a.map((x: any) => [Number.parseFloat(x[0]),Number.parseFloat(x[1])])
        }
    }

    onMessage(event: MessageEvent): void {
        const msg = JSON.parse(event.data as string)
        if(!('stream' in msg)) return
        const data = msg.data
        const symbol = exchangeToCommonSymbol(this.getExchange(),data.s)
        if(this.hasReceivedSOW.has(symbol)) {
            this.publish(this.processUpdateMessage(data))
        } else {
            this.msgBuffer.get(symbol)!.push(data)
        }
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
    }
}