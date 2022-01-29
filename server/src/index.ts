import { Side } from './common'
import { CompositeOrderBook } from './CompositeOrderBook'
import { OrderBookEvent } from './feedhandlers'
import BinanceFeedHandler from './feedhandlers/BinanceFeedHandler'
import CoinbaseFeedHandler from './feedhandlers/CoinbaseFeedHandler'
import FTXFeedHandler from './feedhandlers/FTXFeedHandler'
import KrakenFeedHandler from './feedhandlers/KrakenFeedHandler'
import SmartOrderRouter from './SmartOrderRouter'
import { INVERSE_MARKET_MAPPING } from './symbols'

const SYMBOLS = ['BTC/USD']

const sor = new SmartOrderRouter(SYMBOLS)

setInterval(() => {
    sor.vacuum()
    // compositeBook.print()
    let execs = sor.newOrder('BTC/USD',Side.Buy,10)
    console.log(execs)
}, 5000)