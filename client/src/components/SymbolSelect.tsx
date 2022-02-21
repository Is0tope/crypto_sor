import Dropdown from 'react-bootstrap/esm/Dropdown'

export function SymbolSelect(props: any) {
    const symbols = props.symbols
    const activeSymbol = props.activeSymbol
    const instruments = props.instruments
    const currency = instruments[activeSymbol] ? instruments[activeSymbol].baseCurrency : 'BTC'
    const onSymbolChange = props.onSymbolChange

    const spotSyms = symbols.filter((s:string) => instruments[s].type === 'spot')
    const perpSyms = symbols.filter((s:string) => instruments[s].type === 'perp')
    return (
        <Dropdown style={{marginBottom: '4px'}}>
            <Dropdown.Toggle size="lg" variant="outline-primary" style={{display: 'flex', alignItems:'center'}}>
                {currency && <img alt={currency} src={`/img/icons/${currency}.png`} style={{height: '24px', marginRight: '6px'}}/>}
                <span>{activeSymbol}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Header>Spot</Dropdown.Header>
                {spotSyms.map((s: string) => <Dropdown.Item key={s} onClick={() => onSymbolChange(s)}>{s}</Dropdown.Item>)}
                <Dropdown.Header>Perpetuals</Dropdown.Header>
                {perpSyms.map((s: string) => <Dropdown.Item key={s} onClick={() => onSymbolChange(s)}>{s}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
    )
}
