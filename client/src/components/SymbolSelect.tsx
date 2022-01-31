import Dropdown from 'react-bootstrap/esm/Dropdown'

export function SymbolSelect(props: any) {
    const symbols = props.symbols
    const activeSymbol = props.activeSymbol

    const currency = activeSymbol.split('/')[0]
    const onSymbolChange = props.onSymbolChange

    return (
        <Dropdown style={{marginBottom: '4px'}}>
            <Dropdown.Toggle size="lg" variant="outline-primary" style={{display: 'flex', alignItems:'center'}}>
                {currency && <img src={`/img/icons/${currency}.png`} style={{height: '24px', marginRight: '6px'}}/>}
                <span>{activeSymbol}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {symbols.map((s: string) => <Dropdown.Item key={s} onClick={() => onSymbolChange(s)}>{s}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
    )
}
