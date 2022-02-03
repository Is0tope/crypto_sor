export const INSTRUMENTS: any = {
    'BTC/USD': {
        basePrecision: 6,
        quotePrecision: 2,
        mapping: {
            FTX: 'BTC/USD',
            Coinbase: 'BTC-USD',
            Binance: 'BTCBUSD',
            Kraken: 'XBT/USD',
            OKX: 'BTC-USDC'
        }
    },
    'ETH/USD': {
        basePrecision: 3,
        quotePrecision: 2,
        mapping: {
            FTX: 'ETH/USD',
            Coinbase: 'ETH-USD',
            Binance: 'ETHBUSD',
            Kraken: 'ETH/USD',
            OKX: 'ETH-USDC'
        }
    },
    'BNB/USD': {
        basePrecision: 2,
        quotePrecision: 3,
        mapping: {
            FTX: 'BNB/USD',
            Coinbase: 'BNB-USD',
            Binance: 'BNBBUSD',
            Kraken: 'BNB/USD',
            OKX: 'BNB-USDC'
        }
    },
    'SOL/USD': {
        basePrecision: 2,
        quotePrecision: 4,
        mapping: {
            FTX: 'SOL/USD',
            Coinbase: 'SOL-USD',
            Binance: 'SOLBUSD',
            Kraken: 'SOL/USD',
            OKX: 'SOL-USDC'
        }
    },
    'ADA/USD': {
        basePrecision: 2,
        quotePrecision: 4,
        mapping: {
            FTX: 'ADA/USD',
            Coinbase: 'ADA-USD',
            Binance: 'ADABUSD',
            Kraken: 'ADA/USD',
            OKX: 'ADA-USDC'
        }
    },
    'XRP/USD': {
        basePrecision: 1,
        quotePrecision: 6,
        mapping: {
            FTX: 'XRP/USD',
            Coinbase: 'XRP-USD',
            Binance: 'XRPBUSD',
            Kraken: 'XRP/USD',
            OKX: 'XRP-USDC'
        }
    },
    'LUNA/USD': {
        basePrecision: 2,
        quotePrecision: 2,
        mapping: {
            FTX: 'LUNA/USD',
            Coinbase: 'LUNA-USD',
            Binance: 'LUNABUSD',
            Kraken: 'LUNA/USD',
            OKX: 'LUNA-USDC'
        }
    },
    'DOGE/USD': {
        basePrecision: 1,
        quotePrecision: 7,
        mapping: {
            FTX: 'DOGE/USD',
            Coinbase: 'DOGE-USD',
            Binance: 'DOGEBUSD',
            Kraken: 'XDG/USD',
            OKX: 'DOGE-USDC'
        }
    }
}

export const EXCHANGES = ['FTX', 'Coinbase', 'Binance', 'Kraken','OKX']

export const INVERSE_INSTRUMENTS: any = (() => {
    const ret: any = {}
    EXCHANGES.forEach((ex: string) => {
        ret[ex] = {}
    })
    for(const common of Object.keys(INSTRUMENTS)) {
        for(const e of EXCHANGES) {
            const exSym = INSTRUMENTS[common].mapping[e]
            ret[e][exSym] = common
        }
    }
    return ret
})()

export const SYMBOLS = Object.keys(INSTRUMENTS)

export function commonToExchangeSymbol(exchange: string, sym: string): string {
    return INSTRUMENTS[sym].mapping[exchange]
}

export function exchangeToCommonSymbol(exchange: string, sym: string): string {
    return INVERSE_INSTRUMENTS[exchange][sym]
}

