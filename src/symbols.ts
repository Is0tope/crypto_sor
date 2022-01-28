export const MARKET_MAPPING: any = {
    'FTX': {
        'BTC/USD': 'BTC/USD',
        'ETH/USD': 'ETH/USD',
        'BNB/USD': 'BNB/USD',
        'ADA/USD': 'AFA/USD',
        'XRP/USD': 'XRP/USD',
        'LUNA/USD': 'LUNA/USD',
        'DOGE/USD': 'DOGE/USD',
    },
    'Coinbase': {
        'BTC/USD': 'BTC-USD',
        'ETH/USD': 'ETH-USD',
        'BNB/USD': 'BNB-USD',
        'ADA/USD': 'AFA-USD',
        'XRP/USD': 'XRP-USD',
        'LUNA/USD': 'LUNA-USD',
        'DOGE/USD': 'DOGE-USD',
    },
}

export const INVERSE_MARKET_MAPPING: any = (() => {
    const ret: any = {}
    for(const ex of Object.keys(MARKET_MAPPING)){
        const original = MARKET_MAPPING[ex]
        const map: any = {}
        for(const sym of Object.keys(original)) {
            map[original[sym]] = sym
        }
        ret[ex] = map
    }
    return ret
})()

export function commonToExchangeSymbol(exchange: string, sym: string): string {
    return MARKET_MAPPING[exchange][sym]
}

export function exchangeToCommonSymbol(exchange: string, sym: string): string {
    return INVERSE_MARKET_MAPPING[exchange][sym]
}

