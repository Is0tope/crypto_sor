# crypto_sor
Example consolidated order book and simulated **Smart Order Router** (SOR) for crypto markets. This application is a companion to the [associated blog post](https://machow.ski/posts/consolidated_order_books_and_smart_order_routers/) which is recommended reading to understand what it does.

Check out [cryptosor.info](https://cryptosor.info) to see it live.

*This application is not production ready, and should not be used for trading. It is for educational purposes only, and the author accepts no responsibility for any losses incurred.*

## Overview
This system consists of two processes: a backend server and front end UI, which are located in the `server` and `client` directories respectively.

### Server
The server connects to the public WebSocket feed of several exchanges, and will source order book depth information. It uses this to maintain a consolidated order book for each of the symbols it listens to. The server exposes an API via a `fastify` HTTP server.

### Client
The client is a `create-react-app` generated React application that uses information from the server to display the consolidated order book, and allows simulated orders to be placed.

## Running
### Server
1. Install dependencies
   ```
   cd server
   yarn install
   ```
2. Start the server
   ```
   yarn dev
   ```
3. Server will start listening on port `8080`

### Client
1. Install dependencies
   ```
   cd client
   yarn install
   ```
2. Start the client
   ```
   yarn start
   ```
3. Client can be accessed by pointing your browser to `http://localhost:3000`.

## Testing
Due to this being an example application there is limited testing, however tests for the `server` can be run as follows:

```
cd server
yarn test
```

## Potential Improvements
- Currently the order book is not super efficient, as it uses priority queues, and potentially an array based model might be better (though more complex).
- The order book is just fetched every second using REST. This is simple, but obviously is inefficient. This should be done via a WebSocket connection and the publishing of partials and updates.
- Load could be reduced by pulling an order book snapshot frequently and storing it in a cache. This would be more efficient for matching.
- Better handling and monitoring of WebSocket connections to improve data quality and integrity.
- Improve typing around exchange messages as well as the typing on the front end.

## Supported Markets
- FTX
- Coinbase
- Binance
- Kraken
- OKX

## Supported Symbols
- BTC/USD
- ETH/USD
- BNB/USD
- SOL/USD
- ADA/USD
- XRP/USD
- LUNA/USD
- DOGE/USD

