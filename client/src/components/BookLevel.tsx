import { CSSProperties } from 'react'
import Badge from 'react-bootstrap/esm/Badge'
import { EXCHANGE_COLORS } from '../symbology'

export default function BookLevel(props: any) {
    const columns = []
    const data = props.data
    const exchange: string = data.exchange
    const side = props.side
    const crossed = props.crossed
    const size: number = data.size
    const price: number = data.price
    const { basePrecision, quotePrecision } = props.config
    const vertical: boolean = props.vertical
    const pctSize = 100 * data.runningSize / data.maximumSize

    const exchangeColor = EXCHANGE_COLORS[exchange] || ''

    const sizeBar = (pct: number) => {
        const style: CSSProperties = {
            width: `${pctSize}%`,
            background: side === 'ask' ? 'rgba(212, 63, 63, 0.4)' : 'rgba(50, 168, 82, 0.4)',
        }
        if(side === 'ask' || vertical) {
            style.left = 0
        } else {
            style.right = 0
        }

        return <div 
            className="size-bar" 
            style={style}
        ></div>
    }

    columns.push(
        <td key="exchange" style={{position: 'relative', textAlign: side === 'bid' || vertical ? 'left' : 'right', width:'30%'}}>
            <Badge 
                ref={(el: any) => {
                    if (el) {
                      el.style.setProperty('background-color', exchangeColor, 'important');
                    }
                  }}
            >{exchange}</Badge>
        </td>
    )

    columns.push(
        <td key="size" style={{position: 'relative', width: '50%', textAlign: side === 'ask' || vertical ? 'left' : 'right'}}>
            {sizeBar(pctSize)}
            {size.toLocaleString(undefined,{minimumFractionDigits: basePrecision})}
        </td>
    )

    const priceStyle: CSSProperties = {width: '20%', textAlign: side === 'ask' || vertical ? 'left' : 'right'}
    if(crossed) {
        priceStyle.color = 'red'
    }
    columns.push(
        <td key="price" style={priceStyle}>
            {price.toLocaleString(undefined,{minimumFractionDigits: quotePrecision})}
        </td>
        )

    if(side === 'ask' && !vertical) {
        columns.reverse()
    }
    return (
        <tr>
            {columns}
        </tr>
    )
}