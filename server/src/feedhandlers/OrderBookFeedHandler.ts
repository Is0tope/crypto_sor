import ReconnectingWebSocket, { Event } from 'reconnecting-websocket'
import { CloseEvent } from 'reconnecting-websocket/dist/events'
import WebSocket, { MessageEvent } from 'ws'
import { OrderBookEvent } from '.'
import logger from '../logger'

const NO_MESSAGE_RECEIVED_TIMEOUT = 30_000
const TIMEOUT_CHECK_PERIOD = 5_000

export interface BaseOrderBookFeedHandler {
    onOpen: (event: Event) => void
    onMessage: (event: MessageEvent) => void
}

export class OrderBookFeedHandler implements BaseOrderBookFeedHandler{
    private exchange: string
    protected ws: ReconnectingWebSocket
    private eventHandlers: ((event: OrderBookEvent) => void)[]
    private lastMsgReceived: Date

    constructor(exchange: string, wsUrl: string) {
        this.exchange = exchange
        this.eventHandlers = []
        this.lastMsgReceived = new Date()
        this.ws = new ReconnectingWebSocket(wsUrl, [],  {
            WebSocket: WebSocket,
            debug: false
        })

        this.ws.onopen = (e: Event) => {
            logger.info(`WebSocket connection for ${this.exchange} opened`)
            this.onOpen(e)
        }

        this.ws.onmessage = (e: MessageEvent) => {
            this.lastMsgReceived = new Date()
            this.onMessage(e)
        }

        this.ws.onclose = (e: CloseEvent) => {
            logger.warn(`WebSocket connection for ${this.exchange} closed`)
        }

        setInterval(() => {
            this.checkLastMsgReceived()
        },TIMEOUT_CHECK_PERIOD)
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

    checkLastMsgReceived() {
        const now = new Date()
        const timeDelta = now.getTime() - this.lastMsgReceived.getTime()
        if(timeDelta > NO_MESSAGE_RECEIVED_TIMEOUT) {
            logger.error(`No message received from ${this.getExchange()} for ${(timeDelta/1000).toFixed(1)}s`)
            this.reconnect()
        }
    }
}