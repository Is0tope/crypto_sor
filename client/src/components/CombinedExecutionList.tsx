function execCard(e: any, config: any, vertical: boolean) {
    return (
        <tr key={`${e.exchange}`} className="execution-row">
            <td style={{display: 'flex', alignItems:'center'}}><img alt={e.exchange} src={`/img/exchanges/${e.exchange}.png`} style={{ height: '22px', marginRight: '6px'}}/>{e.exchange}</td>
            {!vertical && <td>{e.symbol}</td>}
            <td><strong style={{color: e.side === 'Sell' ? 'rgb(212, 63, 63)' : 'rgb(50, 168, 82)'}}>{e.side}</strong></td>
            <td>{(e.size as number).toLocaleString(undefined,{maximumFractionDigits: config.basePrecision})}</td>
            <td>{(e.avgPx as number).toLocaleString(undefined,{maximumFractionDigits: config.quotePrecision})}</td>
        </tr>
    )
}

export default function CombinedExecutionList(props: any) {
    const executions = props.executions
    const config = props.config
    const vertical: boolean = props.vertical

    return (
        <table style={{width: '100%', borderSpacing:'0 20px', borderCollapse: 'separate'}}>
                <thead>
                    <tr>
                        <th><strong>Exchange</strong></th>
                        {!vertical && <th><strong>Symbol</strong></th>}
                        <th><strong>Side</strong></th>
                        <th><strong>Size</strong></th>
                        <th><strong>Avg. Price</strong></th>
                    </tr>
                </thead>
                <tbody>
                    {executions.map((e: any) => execCard(e,config,vertical))}         
                </tbody>
        </table>
    )
}