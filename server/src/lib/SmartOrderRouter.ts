import { Side } from './common'
import { CompositeOrderBook, Execution, PriceLevel } from './CompositeOrderBook'
import { OrderBookEvent } from '../feedhandlers'
import BinanceFeedHandler from '../feedhandlers/BinanceFeedHandler'
import CoinbaseFeedHandler from '../feedhandlers/CoinbaseFeedHandler'
import FTXFeedHandler from '../feedhandlers/FTXFeedHandler'
import KrakenFeedHandler from '../feedhandlers/KrakenFeedHandler'
import { OrderBookFeedHandler } from '../feedhandlers/OrderBookFeedHandler'
import OKXFeedHandler from '../feedhandlers/OKXFeedHandler'
import { getCommonSymbolsForExchangeAndType, InstrumentType } from './symbols'
import KrakenFuturesFeedHandler from '../feedhandlers/KrakenFuturesFeedHandler'
import MangoFeedHandler from '../feedhandlers/MangoFeedHandler'

export default class SmartOrderRouter {
    private symbols: string[]
    private exchanges: string[]
    private feedhandlers: OrderBookFeedHandler[]
    private orderbooks: Map<string,CompositeOrderBook>

    constructor(symbols: string[], exchanges: string[]) {
        this.symbols = symbols
        this.exchanges = exchanges

        this.feedhandlers = []
        this.exchanges.forEach((e: string) => {
            const syms = getCommonSymbolsForExchangeAndType(e).filter((x: string) => this.symbols.includes(x))
            const spotSyms = getCommonSymbolsForExchangeAndType(e,InstrumentType.Spot).filter((x: string) => this.symbols.includes(x))
            const perpSyms = getCommonSymbolsForExchangeAndType(e,InstrumentType.Perp).filter((x: string) => this.symbols.includes(x))
            if(e === 'FTX'){
                this.feedhandlers.push(new FTXFeedHandler(syms))
                return
            }
            if(e === 'Coinbase'){
                this.feedhandlers.push(new CoinbaseFeedHandler(syms))
                return
            }
            if(e === 'Binance'){
                this.feedhandlers.push(new BinanceFeedHandler(syms))
                return
            }
            if(e === 'Kraken'){
                this.feedhandlers.push(new KrakenFeedHandler(spotSyms))
                // this.feedhandlers.push(new KrakenFuturesFeedHandler(perpSyms))
                return
            }
            if(e === 'OKX'){
                this.feedhandlers.push(new OKXFeedHandler(syms))
                return
            }
            if(e === 'Mango'){
                this.feedhandlers.push(new MangoFeedHandler(perpSyms))
                return
            }
            throw new Error(`${e} is not supported`)

        })
        this.feedhandlers.forEach((fh: OrderBookFeedHandler) => {
            fh.onEvent((e: OrderBookEvent) => {
                this.routeEventToBook(fh!.getExchange(),e)
            })
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