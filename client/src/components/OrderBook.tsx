import axios from 'axios'
import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/esm/Table'
import { getBook } from '../api'
import BookSide from './BookSide'

const BOOK_UPDATE_PERIOD = 1_000

export default function OrderBook(props: any) {
    const symbol = props.symbol

    const [bids,setBids] = useState([])
    const [asks,setAsks] = useState([])

    const updateBook = async () => {
        console.log('Updating books')
        try {
            const {bids,asks} = await getBook(symbol)
            console.log(bids)
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
    },[symbol])

    return (
        <div className="d-flex flex-row">
            <div style={{ width: '50%'}}>
                <BookSide symbol={symbol} data={bids} side="bid" />
            </div>
            <div style={{ width: '50%'}}>
                <BookSide symbol={symbol} data={asks} side="ask" />
            </div>
        </div>
    )
}