export enum InstrumentType {
    Spot = 'spot',
    Perp = 'perp'
}

export const INSTRUMENTS: any = {
    'BTC/USD': {
        basePrecision: 6,
        quotePrecision: 2,
        baseCurrency: 'BTC',
        quoteCurrency: 'USD',
        type: InstrumentType.Spot,
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
        baseCurrency: 'ETH',
        quoteCurrency: 'USD',
        type: InstrumentType.Spot,
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
        baseCurrency: 'BNB',
        quoteCurrency: 'USD',
        type: InstrumentType.Spot,
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
        baseCurrency: 'SOL',
        quoteCurrency: 'USD',
        type: InstrumentType.Spot,
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
        baseCurrency: 'ADA',
        quoteCurrency: 'USD',
        type: InstrumentType.Spot,
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
        baseCurrency: 'XRP',
        quoteCurrency: 'USD',
        type: InstrumentType.Spot,
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
        baseCurrency: 'LUNA',
        quoteCurrency: 'USD',
        type: InstrumentType.Spot,
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
        baseCurrency: 'DOGE',
        quoteCurrency: 'USD',
        type: InstrumentType.Spot,
        mapping: {
            FTX: 'DOGE/USD',
            Coinbase: 'DOGE-USD',
            Binance: 'DOGEBUSD',
            Kraken: 'XDG/USD',
            OKX: 'DOGE-USDC'
        }
    },

    'BTC-PERP': {
        basePrecision: 6,
        quotePrecision: 2,
        baseCurrency: 'BTC',
        quoteCurrency: 'USD',
        type: InstrumentType.Perp,
        mapping: {
            FTX: 'BTC-PERP',
            // Kraken: 'PI_XBTUSD',
            // OKX: 'BTC-USD-SWAP',
            Mango: 'BTC-PERP'
        }
    },
    'ETH-PERP': {
        basePrecision: 3,
        quotePrecision: 2,
        baseCurrency: 'ETH',
        quoteCurrency: 'USD',
        type: InstrumentType.Perp,
        mapping: {
            FTX: 'ETH-PERP',
            // Kraken: 'PI_ETHUSD',
            // OKX: 'ETH-USD-SWAP',
            Mango: 'ETH-PERP'
        }
    },
    'BNB-PERP': {
        basePrecision: 2,
        quotePrecision: 3,
        baseCurrency: 'BNB',
        quoteCurrency: 'USD',
        type: InstrumentType.Perp,
        mapping: {
            FTX: 'BNB-PERP',
            // Kraken: 'PI_BNBUSD',
            // OKX: 'BNB-USD-SWAP',
            Mango: 'BNB-PERP'
        }
    },
    'SOL-PERP': {
        basePrecision: 2,
        quotePrecision: 4,
        baseCurrency: 'SOL',
        quoteCurrency: 'USD',
        type: InstrumentType.Perp,
        mapping: {
            FTX: 'SOL-PERP',
            // Kraken: 'PI_SOLUSD',
            // OKX: 'SOL-USD-SWAP',
            Mango: 'SOL-PERP'
        }
    },
    'LUNA-PERP': {
        basePrecision: 2,
        quotePrecision: 2,
        baseCurrency: 'LUNA',
        quoteCurrency: 'USD',
        type: InstrumentType.Perp,
        mapping: {
            FTX: 'LUNA-PERP',
            // Kraken: 'PI_LUNAUSD',
            // OKX: 'LUNA-USD-SWAP',
            Mango: 'LUNA-PERP'
        }
    },

}

export const EXCHANGES = ['FTX', 'Coinbase', 'Binance', 'Kraken', 'OKX', 'Mango']

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

export function getCommonSymbolsForExchangeAndType(exchange: string, typ?: InstrumentType): string[] {
    const ret: string[] = []
    for(const common of Object.keys(INSTRUMENTS)) {
        if(typ) {
            if(INSTRUMENTS[common].type !== typ) continue
        }
        if(exchange in INSTRUMENTS[common].mapping) {
            ret.push(common)
        }
    }
    return ret
}

export function getCommonSymbolType(s: string): InstrumentType {
    return INSTRUMENTS[s].type
}


// TODO: Get this from exchange
export const CONTRACT_SIZE: any = {
    OKX: {
        'BTC-PERP': 100,
        'ETH-PERP': 10,
        'BNB-PERP': 10,
        'SOL-PERP': 10,
        'LUNA-PERP': 10,
    }
}

export function getContractSize(exchange: string, symbol: string): number {
    const x = CONTRACT_SIZE[exchange]
    return x !== undefined ? x[symbol] || 1 : 1
}