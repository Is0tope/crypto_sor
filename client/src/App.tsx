import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Card from 'react-bootstrap/esm/Card'
import OrderBook from './components/OrderBook'
import { getSymbolInfo } from './api'
import { SymbolSelect } from './components/SymbolSelect'
import { ExchangeSelect } from './components/ExchangeSelect'
import { OrderForm } from './components/OrderForm'

function App() {
  const [symbols,setSymbols] = useState([])
  const [activeSymbol,setActiveSymbol] = useState('')

  const [exchanges,setExchanges] = useState([] as string[])
  const [activeExchanges,setActiveExchanges] = useState([] as string[])

  const [instruments,setInstruments] = useState({})

  useEffect(() => {
    const fn = async () => {
      const data = await getSymbolInfo()
      setSymbols(data.symbols)
      setExchanges(data.exchanges)
      setActiveExchanges(data.exchanges)
      setInstruments(data.instruments)
      if(data.symbols.length > 0) {
        setActiveSymbol(data.symbols[0])
      }
    }
    fn()
  },[])

  const toggleExchange = (ex: string) => {
    if(activeExchanges.includes(ex)) {
        setActiveExchanges(activeExchanges.filter((x: string) => x !== ex))
    } else {
        setActiveExchanges(activeExchanges.concat(ex))
    }
  }

  const onActiveSymbolChange = (s: string) => {
    setActiveSymbol(s)
  }

  return (
    <div className="App">
      {/* <div className="body-header"></div>
      <div className="body-header-line"></div> */}
      <Container className="offset-container">
        <Row>
          <Col className="title-col">
            <h1>Crypto SOR</h1>
          </Col>
        </Row>

        <Row>
          <Col className="selector-col">
          <Card>
            <Card.Body>
              <Row className="row-cols-auto">
                <Col style={{fontSize: '24pt'}}>
                  Symbol
                </Col>
                <Col>
                  <SymbolSelect symbols={symbols} activeSymbol={activeSymbol} onSymbolChange={onActiveSymbolChange}/>
                </Col>
                <Col style={{fontSize: '24pt'}}>
                  Exchanges
                </Col>
                <Col>
                  <ExchangeSelect 
                    exchanges={exchanges}
                    activeExchanges={activeExchanges}
                    onExchangeClicked={toggleExchange}/>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          </Col>
        </Row>

        <Row>
          <Col className="book-col">
          <Card>
            <Card.Body>
              <OrderBook symbol={activeSymbol} exchanges={activeExchanges} instruments={instruments}/>
              <small><span style={{color: 'red'}}>red</span> price indicates crossed price level.</small>
            </Card.Body>
          </Card>
          </Col>
        </Row>

        <Row>
          <Col className="order-col">
          <Card>
            <Card.Body>
              <OrderForm symbol={activeSymbol} />
            </Card.Body>
          </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
