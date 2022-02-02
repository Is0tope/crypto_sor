import Table from 'react-bootstrap/esm/Table'
import BookLevel from './BookLevel'

export default function BookSide(props: any) {
    const cols: any[] = []
    const side = props.side

    const symbol = props.symbol
    const data: any[] = props.data.slice()
    const config = props.config
    const bestOpposite = props.bestOpposite
    const [baseSymbol,quoteSymbol] = symbol.split('/')
    const vertical: boolean = props.vertical

    cols.push(<th key="exchange">Exchange</th>)
    cols.push(<th key="size">{`Size (${baseSymbol})`}</th>)
    cols.push(<th key="price">{`Price (${quoteSymbol})`}</th>)

    if(side === 'ask' && !vertical) {
        cols.reverse()
    }
    if(side === 'ask' && vertical) {
        data.reverse()
    }

    const hideHeader = side === 'bid' && vertical

    const generateKey = (exchange: string, symbol: string, price: number): string => {
        return ` ${exchange}|${symbol}|${price}`
    }


    return (
        <Table striped bordered hover className={side === 'ask' ? 'vertical-ask-table' :''}>
            {!hideHeader &&
                <thead>
                    <tr>
                        {cols}
                    </tr>
                </thead>
            }
            <tbody>
                {data.map((level: any) => <BookLevel 
                    key={generateKey(level.exchange,symbol,level.price)}
                    side={props.side}
                    data={level}
                    crossed={side === 'bid' ? level.price >= bestOpposite : level.price <= bestOpposite}
                    config={config}
                    vertical={vertical}
                />)}
            </tbody>
        </Table>
    )
}