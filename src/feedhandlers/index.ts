export interface OrderBookFeedHandler {
    onEvent: (fn: (event: OrderBookEvent) => void) => void
}

export enum OrderBookAction {
    Partial,
    Update,
}

export enum Side {
    Buy,
    Sell
}

export type PriceLevel = [number,number]

export interface OrderBookEvent {
    action: OrderBookAction,
    symbol: string,
    bids: PriceLevel[],
    asks: PriceLevel[]
}