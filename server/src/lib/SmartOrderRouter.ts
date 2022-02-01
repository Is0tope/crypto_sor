import { Side } from './common'
import { CompositeOrderBook, Execution, PriceLevel } from './CompositeOrderBook'
import { OrderBookEvent } from '../feedhandlers'
import BinanceFeedHandler from '../feedhandlers/BinanceFeedHandler'
import CoinbaseFeedHandler from '../feedhandlers/CoinbaseFeedHandler'
import FTXFeedHandler from '../feedhandlers/FTXFeedHandler'
import KrakenFeedHandler from '../feedhandlers/KrakenFeedHandler'
import { OrderBookFeedHandler } from '../feedhandlers/OrderBookFeedHandler'
import logger from '../logger'

export default class SmartOrderRouter {
    private supportedExchanges = ['FTX', 'Coinase', 'Binance', 'Kraken']
    private symbols: string[]
    private exchanges: string[]
    private feedhandlers: Map<string,OrderBookFeedHandler>
    private orderbooks: Map<string,CompositeOrderBook>

    constructor(symbols: string[], exchanges: string[]) {
        this.symbols = symbols
        this.exchanges = exchanges

        this.feedhandlers = new Map()
        this.exchanges.forEach((e: string) => {
            let fh: OrderBookFeedHandler | null = null
            switch(e) {
                case 'FTX':
                    fh = new FTXFeedHandler(this.symbols)
                    break
                case 'Coinbase':
                    fh = new CoinbaseFeedHandler(this.symbols)
                    break
                case 'Binance':
                    fh = new BinanceFeedHandler(this.symbols)
                    break
                case 'Kraken':
                    fh = new KrakenFeedHandler(this.symbols)
                    break
                default:
                    throw new Error(`${e} is not supported`)
            }
            fh.onEvent((e: OrderBookEvent) => {
                this.routeEventToBook(fh!.getExchange(),e)
            })
            this.feedhandlers.set(e,fh)
        })

        this.orderbooks = new Map()
        for(const s of this.symbols) {
            this.orderbooks.set(s,new CompositeOrderBook(s))
        }
    }

    routeEventToBook(exchange: string, e: OrderBookEvent) {
        this.orderbooks.get(e.symbol)!.processExternalOrderBookEvent(exchange,e)
    }

    newOrder(symbol: string, side: Side, orderQty: number, exchanges?: string[]): Execution[] {
        const book = this.orderbooks.get(symbol)!
        if(exchanges) {
            return book.newOrder(side,orderQty,exchanges)
        }
        return book.newOrder(side,orderQty)
    }

    vacuum() {
        this.orderbooks.forEach((book: CompositeOrderBook) => book.vacuum())
    }

    reconnect() {
        this.feedhandlers.forEach((fh: OrderBookFeedHandler) => fh.reconnect())
    }

    getBids(symbol: string): PriceLevel[] {
        return this.orderbooks.get(symbol)!.getBids(true)
    }

    getAsks(symbol: string): PriceLevel[] {
        return this.orderbooks.get(symbol)!.getAsks(true)
    }
}