import Dropdown from 'react-bootstrap/esm/Dropdown'

export function SymbolSelect(props: any) {
    const symbols = props.symbols
    const activeSymbol = props.activeSymbol

    const onSymbolChange = props.onSymbolChange

    return (
        <Dropdown>
            <Dropdown.Toggle size="lg" variant="outline-primary" id="dropdown-basic">
                {activeSymbol}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {symbols.map((s: string) => <Dropdown.Item key={s} onClick={() => onSymbolChange(s)}>{s}</Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
    )
}
