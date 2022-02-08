import { CSSProperties } from 'react'

const combineExecutions = (execs: any[]): any[] => {
    if(execs.length === 0) return []
    const combined: any = {}
    let side = ''
    for(const e of execs) {
        const exchange: string = e.exchange
        const size: number = e.lastQty
        const price: number = e.lastPrice
        const symbol: string = e.symbol
        side = e.side === 0 ? 'Buy' : 'Sell'
        if(!Object.keys(combined).includes(exchange)){
            combined[exchange] = {
                exchange: exchange,
                symbol: symbol,
                size: size,
                cost: size * price,
                initPrice: price,
                worstPrice: price
            }
        } else {
            const e = combined[exchange]
            e.size += size
            e.cost += size * price
            e.worstPrice = side === 'Buy' ? Math.max(e.worstPrice,price) : Math.min(e.worstPrice,price)
        }
    }
    for(const k of Object.keys(combined)) {
        const el = combined[k] as any
        combined[k].avgPx = el.cost / el.size
        combined[k].pctImpact = 100*((el.worstPrice/el.initPrice) - 1)
        combined[k].side = side
    }
    // Sort by average price
    const ret = Object.keys(combined).map((k: string) => combined[k])
    ret.sort((a: any, b: any) => {
        return side === 'Buy' ? a.avgPx - b.avgPx : b.avgPx - a.avgPx
    })
    return ret
}

function execCard(e: any, config: any, vertical: boolean) {
    return (
        <tr key={`${e.exchange}`} className="execution-row">
            <td style={{display: 'flex', alignItems:'center'}}><img alt={e.exchange} src={`/img/exchanges/${e.exchange}.png`} style={{ height: '22px', marginRight: '6px'}}/>{e.exchange}</td>
            {!vertical && <td>{e.symbol}</td>}
            {!vertical && <td><strong style={{color: e.side === 'Sell' ? 'rgb(212, 63, 63)' : 'rgb(50, 168, 82)'}}>{e.side}</strong></td>}
            <td>{(e.size as number).toLocaleString(undefined,{maximumFractionDigits: config.basePrecision})}</td>
            <td>{(e.avgPx as number).toLocaleString(undefined,{maximumFractionDigits: config.quotePrecision})}</td>
            <td>{`${(e.pctImpact as number).toFixed(2)}%`}</td>
        </tr>
    )
}

export default function CombinedExecutionList(props: any) {
    const executions = props.executions
    const config = props.config
    const vertical: boolean = props.vertical

    const combined = combineExecutions(executions)

    const tableStyle: CSSProperties = {
        width: '100%',
        borderSpacing:'0 20px',
        borderCollapse: 'separate'
    }
    if(vertical){
        tableStyle.fontSize = '10pt'
    }
    return (
        <table style={tableStyle}>
                <thead>
                    <tr>
                        <th><strong>Exchange</strong></th>
                        {!vertical && <th><strong>Symbol</strong></th>}
                        {!vertical && <th><strong>Side</strong></th>}
                        <th><strong>Size</strong></th>
                        <th><strong>Avg. Price</strong></th>
                        <th><strong>Impact</strong></th>
                    </tr>
                </thead>
                <tbody>
                    {combined.map((e: any) => execCard(e,config,vertical))}         
                </tbody>
        </table>
    )
}