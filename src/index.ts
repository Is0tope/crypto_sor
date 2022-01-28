import { OrderBookEvent } from './feedhandlers'
import FTXFeedHandler from './feedhandlers/FTXFeedHandler'

const SYMBOLS = ['BTC/USD', 'ETH/USD']
const ftxHandler = new FTXFeedHandler(SYMBOLS)
ftxHandler.onEvent((e: OrderBookEvent) => {
    console.log(e)
})