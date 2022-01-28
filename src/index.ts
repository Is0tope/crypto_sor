import { OrderBookEvent } from './feedhandlers'
import CoinbaseFeedHandler from './feedhandlers/CoinbaseFeedHandler'
import FTXFeedHandler from './feedhandlers/FTXFeedHandler'
import { INVERSE_MARKET_MAPPING } from './symbols'

const SYMBOLS = ['BTC/USD', 'ETH/USD']

const ftxHandler = new FTXFeedHandler(SYMBOLS)
ftxHandler.onEvent((e: OrderBookEvent) => {
    console.log(e)
})

const coinbaseHandler = new CoinbaseFeedHandler(SYMBOLS)
coinbaseHandler.onEvent((e: OrderBookEvent) => {
    console.log(e)
})
