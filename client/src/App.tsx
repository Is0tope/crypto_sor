import { useEffect, useState } from 'react';
import './App.css';
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
  const [windowWidth,setWindowWidth] = useState(window.innerWidth)

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

  // Make order book vertical if viewport is small
  useEffect(() => {
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth))
  },[])
  const vertical = windowWidth < 768

  return (
    <div className="App">
      <Container className="offset-container">
        <Row>
          <Col className="title-col">
            <h1>Crypto SOR</h1>
            <p>A consolidated order book and simulated Smart Order Router for multiple CeFi exchanges. For more information, check out the <a href="https://machow.ski/posts/consolidated_order_books_and_smart_order_routers/" rel="noreferrer" target="_blank">blog post</a> or view the <a href="https://github.com/Is0tope/crypto_sor" rel="noreferrer" target="_blank">source code</a>.</p>
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
              <OrderBook symbol={activeSymbol} exchanges={activeExchanges} instruments={instruments} vertical={vertical}/>
              <small><span style={{color: 'red'}}>red</span> price indicates crossed price level.</small>
            </Card.Body>
          </Card>
          </Col>
        </Row>

        <Row>
          <Col className="order-col">
          <Card>
            <Card.Body>
              <OrderForm symbol={activeSymbol} instruments={instruments} exchanges={activeExchanges} vertical={vertical}/>
            </Card.Body>
          </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
