import { EXCHANGE_COLORS } from '../symbology'

export default function BookLevel(props: any) {
    const columns = []
    const data = props.data
    const exchange: string = data.exchange
    const side = props.side
    const size: number = data.size
    const price: number = data.price
    
    const pctSize = 100 * data.runningSize / data.maximumSize

    const exchangeColor = EXCHANGE_COLORS[exchange] || ''

    const exchangeBar = (exchange: string) => {
        const style = {
            width: `20px`,
            background: exchangeColor,
            marginLeft: side === 'bid' ? '0' : `calc(100% - 20px)`
        }
        return <div 
            className="size-bar" 
            style={style}
        ></div>
    }

    const sizeBar = (pct: number) => {
        const style = {
            width: `${pctSize}%`,
            background: side === 'ask' ? 'rgba(212, 63, 63, 0.4)' : 'rgba(50, 168, 82, 0.4)',
            marginLeft: side === 'ask' ? '0' : `${100 - pctSize}%`
        }

        return <div 
            className="size-bar" 
            style={style}
        ></div>
    }

    columns.push(
        <td style={{position: 'relative'}}>
            {exchangeBar(exchange)}
            {exchange}
        </td>
    )

    columns.push(
        <td style={{position: 'relative'}}>
            {sizeBar(pctSize)}
            {size.toLocaleString()}
        </td>
    )

    columns.push(<td>{price.toLocaleString()}</td>)

    if(side === 'ask') {
        columns.reverse()
    }
    return (
        <tr>
            {columns}
        </tr>
    )
}