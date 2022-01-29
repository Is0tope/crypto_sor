export enum OrderBookAction {
    Partial,
    Update,
}

export type PriceLevel = [number,number]

export interface OrderBookEvent {
    action: OrderBookAction,
    symbol: string,
    bids: PriceLevel[],
    asks: PriceLevel[]
}