import Table from 'react-bootstrap/esm/Table'
import BookLevel from './BookLevel'

export default function BookSide(props: any) {
    const cols: any[] = []
    const side = props.side

    const data: any[] = props.data.slice()
    const config = props.config
    const bestOpposite = props.bestOpposite
    const baseSymbol = config.baseCurrency || ''
    const quoteSymbol = config.quoteCurrency || ''
    const vertical: boolean = props.vertical

    const hideHeader = side === 'bid' && vertical
    const headerStyle = {height: hideHeader ? 0 : undefined, padding: hideHeader ? 0 : undefined}
    cols.push(<th style={headerStyle} key="exchange">{hideHeader ? '' : 'Exchange'}</th>)
    cols.push(<th style={headerStyle} key="size">{hideHeader ? '' : `Size (${baseSymbol})`}</th>)
    cols.push(<th style={headerStyle} key="price">{hideHeader ? '' : `Price (${quoteSymbol})`}</th>)

    if(side === 'ask' && !vertical) {
        cols.reverse()
    }
    if(side === 'ask' && vertical) {
        data.reverse()
    }

    return (
        <Table striped bordered hover className={side === 'ask' ? 'vertical-ask-table' :''} style={{width: '100%', tableLayout: 'fixed', marginBottom: 0}}>
            {
                <thead>
                    <tr>
                        {cols}
                    </tr>
                </thead>
            }
            <tbody>
                {data.map((level: any, idx: number) => <BookLevel 
                    key={idx}
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