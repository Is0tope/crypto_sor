import { CompositeOrderBook } from './CompositeOrderBook'
import { OrderBookEvent } from './feedhandlers'
import CoinbaseFeedHandler from './feedhandlers/CoinbaseFeedHandler'
import FTXFeedHandler from './feedhandlers/FTXFeedHandler'
import { INVERSE_MARKET_MAPPING } from './symbols'

const SYMBOLS = ['BTC/USD']

const compositeBook = new CompositeOrderBook('BTC/USD')

const ftxHandler = new FTXFeedHandler(SYMBOLS)
ftxHandler.onEvent((e: OrderBookEvent) => {
    compositeBook.processExternalOrderBookEvent('FTX',e)
})

const coinbaseHandler = new CoinbaseFeedHandler(SYMBOLS)
coinbaseHandler.onEvent((e: OrderBookEvent) => {
    compositeBook.processExternalOrderBookEvent('Coinbase',e)
})

setInterval(() => {
    compositeBook.vacuum()
    compositeBook.print()
}, 5000)