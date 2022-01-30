import axios from 'axios'
import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/esm/Table'
import BookSide from './BookSide'

export default function OrderBook() {
    const [bids,setBids] = useState([])
    const [asks,setAsks] = useState([])

    useEffect(() => {
        const fn = async () => {
            const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL!}/api/book/BTC/USD`)
            const {bids,asks} = res.data
            setBids(bids)
            setAsks(asks)
        }
        fn()
    },[])
    return (
        <div className="d-flex flex-row">
            <div style={{ width: '50%'}}>
                <BookSide data={bids} side="bid" />
            </div>
            <div style={{ width: '50%'}}>
                <BookSide data={asks} side="ask" />
            </div>
        </div>
    )
}