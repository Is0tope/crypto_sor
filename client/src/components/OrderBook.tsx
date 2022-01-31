import { useEffect, useState } from 'react'
import { getBook } from '../api'
import BookSide from './BookSide'

const BOOK_UPDATE_PERIOD = 1_000

const addCumulativeSizes = (bids: any[], asks: any[]) => {
    // Calculate running sums in place
    let sumBids = 0
    for(const l of bids) {
        sumBids += l.size
        l.runningSize = sumBids
    }
    let sumAsks = 0
    for(const l of asks) {
        sumAsks += l.size
        l.runningSize = sumAsks
    }
    const maxSize = Math.max(sumBids,sumAsks)
    bids.forEach((l: any) => l.maximumSize = maxSize)
    asks.forEach((l: any) => l.maximumSize = maxSize)
}

export default function OrderBook(props: any) {
    const symbol = props.symbol
    const exchanges = props.exchanges
    let config = {}
    if(Object.keys(props.instruments).length !== 0) {
        const precisions = props.instruments[symbol] || {}
        config = {
            basePrecision: precisions.basePrecision || 1,
            quotePrecision: precisions.quotePrecision || 1
        }
    }

    const [bids,setBids] = useState([])
    const [asks,setAsks] = useState([])

    const bestBid = ((bids[0] || {}) as any).price || Number.NEGATIVE_INFINITY
    const bestAsk = ((asks[0] || {}) as any).price || Number.POSITIVE_INFINITY

    const updateBook = async () => {
        try {
            const {bids,asks} = await getBook(symbol,exchanges)
            addCumulativeSizes(bids,asks)
            setBids(bids)
            setAsks(asks)
        } catch(e) {
            console.error(e)
            setBids([])
            setAsks([])
        }
    }

    useEffect(() => {
        if(symbol === '') {
            setBids([])
            setAsks([])
            return
        }
        updateBook()
        const timer = setInterval(updateBook, BOOK_UPDATE_PERIOD)
        return () => clearInterval(timer)
    },[symbol,exchanges])

    return (
        <div className="d-flex flex-row">
            <div style={{ width: '50%'}}>
                <BookSide symbol={symbol} data={bids} side="bid" bestOpposite={bestAsk} config={config}/>
            </div>
            <div style={{ width: '50%'}}>
                <BookSide symbol={symbol} data={asks} side="ask" bestOpposite={bestBid} config={config}/>
            </div>
        </div>
    )
}