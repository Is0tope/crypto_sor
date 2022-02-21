import Alert from 'react-bootstrap/esm/Alert'

export default function ExecutionSummary(props: any) {
    const symbol = props.symbol as string || ''
    const config = props.config
    const filled = props.size as number || 0
    const avgPx = props.avgPx as number || 0
    const side = (props.side as string) || 'Buy'
    const base = config.baseCurrency || ''
    const quote = config.quoteCurrency || ''
    let name = base
    if(config.type === 'perp') {
        name = symbol
    }

    

    return(
        <Alert variant={side === 'Buy' ? 'success' : 'danger'} style={{fontSize: '20pt', textAlign: 'center'}}>
            {side === 'Buy' ? 'Bought' : 'Sold'} <strong>{filled.toLocaleString(undefined,{maximumFractionDigits: config.basePrecision})} {name}</strong> for average price of <strong>{avgPx.toLocaleString(undefined,{maximumFractionDigits: config.quotePrecision})} {quote}</strong>
        </Alert>
    )
}