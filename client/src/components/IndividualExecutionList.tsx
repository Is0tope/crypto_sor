import { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/esm/Card'
import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'

function execCard(e: any, config: any) {
    const side = e.side === 0 ? 'Buy' : 'Sell'
    return (
        <Card key={`${e.exchange}|${e.lastPrice}`} className="mb-2">
            <Card.Body>
                <Row>
                    <Col style={{display: 'flex', alignItems:'center'}}><img src={`/img/exchanges/${e.exchange}.png`} style={{ height: '22px', marginRight: '6px'}}/>{e.exchange}</Col>
                    <Col>{e.symbol}</Col>
                    <Col><strong style={{color: side === 'Sell' ? 'rgb(212, 63, 63)' : 'rgb(50, 168, 82)'}}>{side}</strong></Col>
                    <Col>{(e.lastQty as number).toLocaleString(undefined,{maximumFractionDigits: config.basePrecision})}</Col>
                    <Col>{(e.lastPrice as number).toLocaleString(undefined,{maximumFractionDigits: config.quoterecision})}</Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default function IndividualExecutionList(props: any) {
    const PAGE_SIZE = 10
    const [limit,setLimit] = useState(PAGE_SIZE)
    
    const executions = props.executions
    const config = props.config

    const remaining = executions.length - limit
    return (
        <div>
            <Row className="mb-2">
                <Col><strong>Exchange</strong></Col>
                <Col><strong>Symbol</strong></Col>
                <Col><strong>Side</strong></Col>
                <Col><strong>Size</strong></Col>
                <Col><strong>Price</strong></Col>
            </Row>
            {executions.slice(0,limit).map((e: any) => execCard(e,config))}
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
