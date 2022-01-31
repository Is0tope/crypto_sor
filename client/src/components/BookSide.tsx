import Table from 'react-bootstrap/esm/Table'
import BookLevel from './BookLevel'

export default function BookSide(props: any) {
    const cols = ['Venue','Size','Price']
    
    if(props.side === 'ask') {
        cols.reverse()
    }
    const symbol = props.symbol
    const data: any[] = props.data
    const config = props.config

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
                {data.map((level: any) => <BookLevel key={generateKey(level.exchange,symbol,level.price)} side={props.side} data={level} config={config}/>)}
            </tbody>
        </Table>
    )
}