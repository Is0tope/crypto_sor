import ReconnectingWebSocket, { Event } from 'reconnecting-websocket'
import WebSocket, { MessageEvent } from 'ws'
import { OrderBookEvent } from '.'

export interface BaseOrderBookFeedHandler {
    onOpen: (event: Event) => void
    onMessage: (event: MessageEvent) => void
}

export class OrderBookFeedHandler implements BaseOrderBookFeedHandler{
    private exchange: string
    protected ws: ReconnectingWebSocket
    private eventHandlers: ((event: OrderBookEvent) => void)[]

    constructor(exchange: string, wsUrl: string) {
        this.exchange = exchange
        this.eventHandlers = []
        this.ws = new ReconnectingWebSocket(wsUrl, [],  {
            WebSocket: WebSocket,
            debug: false
        })

        this.ws.onopen = (e: Event) => this.onOpen(e)

        this.ws.onmessage = (e: MessageEvent) => this.onMessage(e)
    }
    
    // @override
    onOpen(event: Event) {
        throw Error('Not yet implemented')
    }

    // @override
    onMessage(event: MessageEvent) {
        throw Error('Not yet implemented')
    }

    onEvent(fn: (event: OrderBookEvent) => void) {
        this.eventHandlers.push(fn)
    }

    getExchange(): string {
        return this.exchange
    }

    publish(event: OrderBookEvent) {
        this.eventHandlers.map((fn) => fn(event))
    }
}