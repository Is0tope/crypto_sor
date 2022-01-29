import { Side } from './common'
import { CompositeOrderBook } from './CompositeOrderBook'
import { OrderBookEvent } from './feedhandlers'
import BinanceFeedHandler from './feedhandlers/BinanceFeedHandler'
import CoinbaseFeedHandler from './feedhandlers/CoinbaseFeedHandler'
import FTXFeedHandler from './feedhandlers/FTXFeedHandler'
import KrakenFeedHandler from './feedhandlers/KrakenFeedHandler'
import { INVERSE_MARKET_MAPPING } from './symbols'

const SYMBOLS = ['BTC/USD']

const compositeBook = new CompositeOrderBook('BTC/USD')

// const ftxHandler = new FTXFeedHandler(SYMBOLS)
// ftxHandler.onEvent((e: OrderBookEvent) => {
//     compositeBook.processExternalOrderBookEvent(ftxHandler.getExchange(),e)
// })

// const coinbaseHandler = new CoinbaseFeedHandler(SYMBOLS)
// coinbaseHandler.onEvent((e: OrderBookEvent) => {
//     compositeBook.processExternalOrderBookEvent(coinbaseHandler.getExchange(),e)
// })

// const binanceHandler = new BinanceFeedHandler(SYMBOLS)
// binanceHandler.onEvent((e: OrderBookEvent) => {
//     compositeBook.processExternalOrderBookEvent(binanceHandler.getExchange(),e)
// })

const krakenHandler = new KrakenFeedHandler(SYMBOLS)
krakenHandler.onEvent((e: OrderBookEvent) => {
    console.log(e)
    compositeBook.processExternalOrderBookEvent(krakenHandler.getExchange(),e)
})

setInterval(() => {
    compositeBook.vacuum()
    compositeBook.print()
    let execs = compositeBook.newOrder(Side.Buy,10)
    // console.log(execs)
}, 5000)