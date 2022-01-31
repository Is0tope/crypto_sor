import Table from 'react-bootstrap/esm/Table'
import BookLevel from './BookLevel'

export default function BookSide(props: any) {
    const cols = ['Venue','Size','Price']
    
    if(props.side === 'ask') {
        cols.reverse()
    }
    const symbol = props.symbol
    const data: any[] = props.data

    // Calculate running sums
    let sum = 0
    for(const l of data) {
        sum += l.size
        l.runningSize = sum
    }
    data.forEach((l: any) => l.maximumSize = sum)

    const generateKey = (exchange: string, symbol: string, price: number): string => {
        return ` ${exchange}|${symbol}|${price}`
    }

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    {cols.map((c: string) => <th key={c}>{c}</th> )}
                </tr>
            </thead>
            <tbody>
                {data.map((level: any) => <BookLevel key={generateKey(level.exchange,symbol,level.price)} side={props.side} data={level}/>)}
            </tbody>
        </Table>
    )
}