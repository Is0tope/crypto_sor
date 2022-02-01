import Card from 'react-bootstrap/esm/Card'
import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'

function execCard(e: any, config: any) {
    return (
        <Card key={`${e.exchange}`} className="mb-2">
            <Card.Body>
                <Row>
                    <Col style={{display: 'flex', alignItems:'center'}}><img src={`/img/exchanges/${e.exchange}.png`} style={{ height: '22px', marginRight: '6px'}}/>{e.exchange}</Col>
                    <Col>{e.symbol}</Col>
                    <Col><strong style={{color: e.side === 'Sell' ? 'rgb(212, 63, 63)' : 'rgb(50, 168, 82)'}}>{e.side}</strong></Col>
                    <Col>{(e.size as number).toLocaleString(undefined,{maximumFractionDigits: config.basePrecision})}</Col>
                    <Col>{(e.avgPx as number).toLocaleString(undefined,{maximumFractionDigits: config.quoterecision})}</Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default function CombinedExecutionList(props: any) {
    const executions = props.executions
    const config = props.config

    return (
        <div>
            <Row className="mb-2">
                <Col><strong>Exchange</strong></Col>
                <Col><strong>Symbol</strong></Col>
                <Col><strong>Side</strong></Col>
                <Col><strong>Size</strong></Col>
                <Col><strong>Avg. Price</strong></Col>
            </Row>
            {executions.map((e: any) => execCard(e,config))}         
        </div>
    )
}