import ReconnectingWebSocket, { Event } from 'reconnecting-websocket'
import { CloseEvent } from 'reconnecting-websocket/dist/events'
import WebSocket, { MessageEvent } from 'ws'
import { OrderBookEvent } from '.'
import logger from '../logger'

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

        this.ws.onopen = (e: Event) => {
            logger.info(`WebSocket connection for ${this.exchange} opened`)
            this.onOpen(e)
        }

        this.ws.onmessage = (e: MessageEvent) => this.onMessage(e)

        this.ws.onclose = (e: CloseEvent) => {
            logger.warn(`WebSocket connection for ${this.exchange} closed`)
        }
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

    reconnect() {
        logger.warn(`Reconnect called for ${this.exchange} feed handler`)
        this.ws.reconnect()
    }
}