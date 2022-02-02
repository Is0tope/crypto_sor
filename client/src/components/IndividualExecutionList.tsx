import { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/esm/Card'
import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'

function execCard(e: any, config: any, vertical: boolean) {
    const side = e.side === 0 ? 'Buy' : 'Sell'
    return (
        <tr key={`${e.exchange}|${e.lastPrice}`} className="execution-row">
            <td style={{display: 'flex', alignItems:'center'}}><img alt={e.exchange} src={`/img/exchanges/${e.exchange}.png`} style={{ height: '22px', marginRight: '6px'}}/>{e.exchange}</td>
            {!vertical && <td>{e.symbol}</td>}
            <td><strong style={{color: side === 'Sell' ? 'rgb(212, 63, 63)' : 'rgb(50, 168, 82)'}}>{side}</strong></td>
            <td>{(e.lastQty as number).toLocaleString(undefined,{maximumFractionDigits: config.basePrecision})}</td>
            <td>{(e.lastPrice as number).toLocaleString(undefined,{maximumFractionDigits: config.quoterecision})}</td>
        </tr>
    )
}

export default function IndividualExecutionList(props: any) {
    const PAGE_SIZE = 10
    const [limit,setLimit] = useState(PAGE_SIZE)
    
    const executions = props.executions
    const config = props.config
    const vertical: boolean = props.vertical || false

    const remaining = executions.length - limit
    return (
        <div>
            <table style={{width: '100%', borderSpacing:'0 20px', borderCollapse: 'separate'}}>
                <tr>
                    <th><strong>Exchange</strong></th>
                    {!vertical && <th><strong>Symbol</strong></th>}
                    <th><strong>Side</strong></th>
                    <th><strong>Size</strong></th>
                    <th><strong>Avg. Price</strong></th>
                </tr>
                {executions.slice(0,limit).map((e: any) => execCard(e,config,vertical))}
            </table>
            <Row className="mt-3">
                {remaining > 0 && 
                    <Col className="d-flex justify-content-center">
                        <div style={{textAlign: 'center'}}>
                            <Button variant="outline-primary" onClick={() => setLimit(limit + PAGE_SIZE)}>Load More</Button>
                            <br />
                            <small>{`${remaining.toLocaleString()} executions remaining`}</small>
                        </div>
                    </Col>
                }
            </Row>       
        </div>
    )
}
