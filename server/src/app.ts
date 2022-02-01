import SmartOrderRouter from './lib/SmartOrderRouter'
import { EXCHANGES, SYMBOLS } from './lib/symbols'

export const SOR = new SmartOrderRouter(SYMBOLS,EXCHANGES)