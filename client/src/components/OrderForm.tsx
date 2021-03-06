import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup'
import Col from 'react-bootstrap/esm/Col'
import Dropdown from 'react-bootstrap/esm/Dropdown'
import FormControl from 'react-bootstrap/esm/FormControl'
import InputGroup from 'react-bootstrap/esm/InputGroup'
import Row from 'react-bootstrap/esm/Row'
import ToggleButton from 'react-bootstrap/esm/ToggleButton'
import { newOrder } from '../api'
import CombinedExecutionList from './CombinedExecutionList'
import ExecutionSummary from './ExecutionSummary'
import IndividualExecutionList from './IndividualExecutionList'

enum OrderLoadingState {
    NotLoaded,
    Loading,
    Loaded
}

enum ExecDisplayType {
    Combined,
    Individual
}

export function OrderForm(props: any) {
    const [side, setSide] = useState('Buy')
    const [orderQty, setOrderQty] = useState(1)
    const [execType,setExecType] = useState(ExecDisplayType.Combined)
    const [executions, setExecutions] = useState([] as any[])
    const [execLoadingState, setExecLoadingState] = useState(OrderLoadingState.NotLoaded)

    const symbol = props.symbol
    const instruments = props.instruments
    const exchanges: string[] = props.exchanges
    const currency = instruments[symbol] ? instruments[symbol].baseCurrency : ''
    const vertical: boolean = props.vertical

    // Reset if the symbol changes
    useEffect(() => {
        setExecutions([])
        setExecLoadingState(OrderLoadingState.NotLoaded)
        setOrderQty(1)
    },[symbol])
    // Don't reset the orderQty if just exchanges changed
    useEffect(() => {
        setExecutions([])
        setExecLoadingState(OrderLoadingState.NotLoaded)
    },[exchanges])

    const sendNewOrder = () => {
        const fn = async () => {
            setExecLoadingState(OrderLoadingState.Loading)
            setExecutions([])
            const data = await newOrder(symbol,side,orderQty,exchanges)
            setExecLoadingState(OrderLoadingState.Loaded)
            setExecutions(data)
        }
        fn()
    }

    const updateOrderQty = (e: any) => {
        setOrderQty(e.target.value)
    }

    const executionSummary = (execs: any[]) => {
        if(execs.length === 0) return {}
        let side = ''
        let cumSize = 0
        let cumCost = 0
        for(const e of execs) {
            const size: number = e.lastQty
            const price: number = e.lastPrice
            cumSize += size
            cumCost += size * price
            side = e.side === 0 ? 'Buy' : 'Sell'
        }
        return {
            size: cumSize,
            side: side,
            avgPx: cumCost / cumSize
        }
    }

    const summary = executionSummary(executions)

    return (  
        <div> 
            <Row className="row-cols-auto">
                <Col style={{fontSize: '24pt'}} className="mb-2">
                  Test Order
                </Col>
                <Col className="mb-2">
                    <InputGroup>
                        <Dropdown>
                            <Dropdown.Toggle size="lg" variant={side === 'Buy' ? 'success' : 'danger'} id="dropdown-basic">
                                {side}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {['Buy','Sell'].map((s: string) => <Dropdown.Item key={s} onClick={() => setSide(s)}>{s}</Dropdown.Item>)}
                            </Dropdown.Menu>
                        </Dropdown>
                    </InputGroup>
                </Col>
                <Col className="mb-2">
                    <InputGroup>
                        <FormControl
                            style={{fontSize: '23px'}}
                            placeholder="Order Quantity eg. 100"
                            onChange={updateOrderQty}
                            value={orderQty}
                            type="number"
                        />
                        <InputGroup.Text>{currency}</InputGroup.Text>
                    </InputGroup>
                </Col>
                <Col className="mb-2">
                    <Button variant="primary" size="lg" onClick={sendNewOrder} disabled={!(orderQty > 0)}>Submit</Button>
                </Col>
                <Col className="mb-2">
                    <ButtonGroup className="mb-2">
                        <ToggleButton
                            type="checkbox"
                            variant="outline-secondary"
                            checked={execType === ExecDisplayType.Combined}
                            value="Combined"
                            onClick={(e) => setExecType(ExecDisplayType.Combined)}
                            size="lg"
                        >Combined</ToggleButton>
                        <ToggleButton
                            type="checkbox"
                            variant="outline-secondary"
                            checked={execType === ExecDisplayType.Individual}
                            value="Individual"
                            onClick={(e) => setExecType(ExecDisplayType.Individual)}
                            size="lg"
                        >Individual</ToggleButton>
                    </ButtonGroup>
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col>
                    {execLoadingState === OrderLoadingState.Loaded && <ExecutionSummary side={summary.side} size={summary.size} avgPx={summary.avgPx} symbol={symbol} config={instruments[symbol]} />}
                    <div style={{textAlign: 'center'}}>
                        {execLoadingState === OrderLoadingState.Loaded && <small style={{color: 'red'}}>Some exchanges only provide a limited number of price levels, so liquidity may not be fully representative for large orders.</small>}
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    {execType === ExecDisplayType.Combined && <CombinedExecutionList executions={executions} config={instruments[symbol]} vertical={vertical} />}
                    {execType === ExecDisplayType.Individual && <IndividualExecutionList executions={executions} config={instruments[symbol]} vertical={vertical} />}
                </Col>
            </Row>
            <Row>
                <Col style={{textAlign: 'center'}}>
                    {execLoadingState === OrderLoadingState.Loading ? 'Loading...' : ''}
                </Col>
            </Row>
        </div>
    )
}