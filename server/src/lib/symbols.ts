export const MARKET_MAPPING: any = {
    'FTX': {
        'BTC/USD': 'BTC/USD',
        'ETH/USD': 'ETH/USD',
        'BNB/USD': 'BNB/USD',
        'ADA/USD': 'ADA/USD',
        'XRP/USD': 'XRP/USD',
        'LUNA/USD': 'LUNA/USD',
        'DOGE/USD': 'DOGE/USD',
    },
    'Coinbase': {
        'BTC/USD': 'BTC-USD',
        'ETH/USD': 'ETH-USD',
        'BNB/USD': 'BNB-USD',
        'ADA/USD': 'ADA-USD',
        'XRP/USD': 'XRP-USD',
        'LUNA/USD': 'LUNA-USD',
        'DOGE/USD': 'DOGE-USD',
    },
    // BUSD is used as USD equivalent
    'Binance': {
        'BTC/USD': 'BTCBUSD',
        'ETH/USD': 'ETHBUSD',
        'BNB/USD': 'BNBBUSD',
        'ADA/USD': 'ADABUSD',
        'XRP/USD': 'XRPBUSD',
        'LUNA/USD': 'LUNABUSD',
        'DOGE/USD': 'DOGEBUSD',
    },
    'Kraken': {
        'BTC/USD': 'XBT/USD',
        'ETH/USD': 'ETH/USD',
        'BNB/USD': 'BNB/USD',
        'ADA/USD': 'ADA/USD',
        'XRP/USD': 'XRP/USD',
        'LUNA/USD': 'LUNA/USD',
        'DOGE/USD': 'XDG/USD',
    }
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

export const EXCHANGES = Object.keys(MARKET_MAPPING)

export const SYMBOLS = [...new Set(EXCHANGES.map((x: string) => Object.keys(MARKET_MAPPING[x])).flat())]

export function commonToExchangeSymbol(exchange: string, sym: string): string {
    return MARKET_MAPPING[exchange][sym]
}

export function exchangeToCommonSymbol(exchange: string, sym: string): string {
    return INVERSE_MARKET_MAPPING[exchange][sym]
}

