export default function BookLevel(props: any) {
    const cols = ['exchange','size','price']
    if(props.side === 'ask') {
        cols.reverse()
    }
    const data = props.data
    return (
        <tr>
            {cols.map((c: string) => <td key={c}>{data[c]}</td>)}
        </tr>
    )
}