import { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup'
import Col from 'react-bootstrap/esm/Col'
import Dropdown from 'react-bootstrap/esm/Dropdown'
import Form from 'react-bootstrap/esm/Form'
import FormControl from 'react-bootstrap/esm/FormControl'
import InputGroup from 'react-bootstrap/esm/InputGroup'
import Row from 'react-bootstrap/esm/Row'
import ToggleButton from 'react-bootstrap/esm/ToggleButton'
import { newOrder } from '../api'

export function OrderForm(props: any) {
    const [side, setSide] = useState('Buy')
    const [orderQty, setOrderQty] = useState(0)
    const [execType,setExecType] = useState('Combined')
    
    const symbol = props.symbol
    const currency = symbol.split('/')[0] || ''

    const sendNewOrder = () => {
        const fn = async () => {
            const data = await newOrder(symbol,side,orderQty)
            console.log(data)
            const combined = combineExecutions(data)
            console.log(combined)
        }
        fn()
    }

    const updateOrderQty = (e: any) => {
        setOrderQty(e.target.value)
    }

    const combineExecutions = (execs: any[]): any[] => {
        if(execs.length === 0) return []
        const combined: any = {}
        let side = ''
        for(const e of execs) {
            const exchange: string = e.exchange
            const size: number = e.lastQty
            const price: number = e.lastPrice
            side = e.side === 0 ? 'Buy' : 'Sell'
            if(!Object.keys(combined).includes(exchange)){
                combined[exchange] = {
                    exchange: exchange,
                    size: size,
                    cost: size * price
                }
            } else {
                combined[exchange].size += size
                combined[exchange].cost += size * price
            }
        }
        for(const k of Object.keys(combined)) {
            const el = combined[k] as any
            combined[k].avgPx = el.cost / el.size
            combined[k].side = side
        }
        return Object.keys(combined).map((k: string) => combined[k])
    }

    return (  
        <div> 
            <Row className="row-cols-auto">
                <Col style={{fontSize: '24pt'}}>
                  Test Order
                </Col>
                <Col>
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
                <Col>
                    <InputGroup>
                        <FormControl
                            style={{fontSize: '23px'}}
                            placeholder="Order Quantity eg. 100"
                            onChange={updateOrderQty}
                        />
                        <InputGroup.Text>{currency}</InputGroup.Text>
                    </InputGroup>
                </Col>
                <Col>
                    <Button variant="primary" size="lg" onClick={sendNewOrder} disabled={!(orderQty > 0)}>Submit</Button>
                </Col>
                <Col className="pull-right">
                    <ButtonGroup className="mb-2">
                        <ToggleButton
                            type="checkbox"
                            variant="outline-secondary"
                            checked={execType === 'Combined'}
                            value="Combined"
                            onClick={(e) => setExecType('Combined')}
                            size="lg"
                        >Combined</ToggleButton>
                        <ToggleButton
                            type="checkbox"
                            variant="outline-secondary"
                            checked={execType === 'Individual'}
                            value="Individual"
                            onClick={(e) => setExecType('Individual')}
                            size="lg"
                        >Individual</ToggleButton>
                    </ButtonGroup>
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col>
                </Col>
            </Row>
        </div>
    )
}