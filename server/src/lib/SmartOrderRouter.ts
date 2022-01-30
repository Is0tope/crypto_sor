import { Side } from './common'
import { CompositeOrderBook, Execution, PriceLevel } from './CompositeOrderBook'
import { OrderBookEvent } from '../feedhandlers'
import BinanceFeedHandler from '../feedhandlers/BinanceFeedHandler'
import CoinbaseFeedHandler from '../feedhandlers/CoinbaseFeedHandler'
import FTXFeedHandler from '../feedhandlers/FTXFeedHandler'
import KrakenFeedHandler from '../feedhandlers/KrakenFeedHandler'

export default class SmartOrderRouter {
    private symbols: string[]
    private ftxHandler: FTXFeedHandler
    private coinbaseHandler: CoinbaseFeedHandler
    private binanceHandler: BinanceFeedHandler
    private krakenHandler: KrakenFeedHandler

    private orderbooks: Map<string,CompositeOrderBook>

    constructor(symbols: string[]) {
        this.symbols = symbols

        this.ftxHandler = new FTXFeedHandler(this.symbols)
        this.coinbaseHandler = new CoinbaseFeedHandler(this.symbols)
        this.binanceHandler = new BinanceFeedHandler(this.symbols)
        this.krakenHandler = new KrakenFeedHandler(this.symbols)

        this.orderbooks = new Map()
        for(const s of this.symbols) {
            this.orderbooks.set(s,new CompositeOrderBook(s))
        }

        this.ftxHandler.onEvent((e: OrderBookEvent) => {
            this.routeEventToBook(this.ftxHandler.getExchange(),e)
        })
        
        this.coinbaseHandler.onEvent((e: OrderBookEvent) => {
            this.routeEventToBook(this.coinbaseHandler.getExchange(),e)
        })

        this.binanceHandler.onEvent((e: OrderBookEvent) => {
            this.routeEventToBook(this.binanceHandler.getExchange(),e)
        })

        this.krakenHandler.onEvent((e: OrderBookEvent) => {
            this.routeEventToBook(this.krakenHandler.getExchange(),e)
        })
    }

    routeEventToBook(exchange: string, e: OrderBookEvent) {
        this.orderbooks.get(e.symbol)!.processExternalOrderBookEvent(exchange,e)
    }

    newOrder(symbol: string, side: Side, orderQty: number): Execution[] {
        return this.orderbooks.get(symbol)!.newOrder(side,orderQty)
    }

    vacuum() {
        this.orderbooks.forEach((book: CompositeOrderBook) => book.vacuum())
    }

    getBids(symbol: string): PriceLevel[] {
        return this.orderbooks.get(symbol)!.getBids(true)
    }

    getAsks(symbol: string): PriceLevel[] {
        return this.orderbooks.get(symbol)!.getAsks(true)
    }
}