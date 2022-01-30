import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Card from 'react-bootstrap/esm/Card'
import OrderBook from './components/OrderBook'

function App() {
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
            <Card.Body>This is some text within a card body.</Card.Body>
          </Card>
          </Col>
        </Row>

        <Row>
          <Col className="book-col">
          <Card>
            <Card.Body>
              <OrderBook />
            </Card.Body>
          </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
